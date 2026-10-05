import { AudioPlaybackState, AudioEngineStatus, LanguageCode, TourPoint } from '../types';
import { StorageService } from './storageService';

export type AudioStateListener = (state: AudioPlaybackState) => void;

class AudioEngine {
  private state: AudioPlaybackState = {
    currentPointId: null,
    status: 'IDLE',
    currentTime: 0,
    duration: 45,
    isPlaying: false,
    volume: 1.0,
    playbackRate: 1.0,
    ambientCaveSound: false,
    autoplayEnabled: true,
    confirmingCountdown: 0,
    cooldownRemaining: 0,
  };

  private listeners: Set<AudioStateListener> = new Set();
  private audioEl: HTMLAudioElement | null = null;
  private speechUtterance: SpeechSynthesisUtterance | null = null;
  private progressInterval: number | null = null;
  private cooldownInterval: number | null = null;
  private confirmationTimeout: number | null = null;

  // TTS Stream queue for languages without local browser voices (like Arabic)
  private ttsQueue: string[] = [];
  private currentTtsIndex: number = 0;
  private isPlayingTtsStream: boolean = false;
  private currentStreamLang: LanguageCode = 'es';
  private cachedVoices: SpeechSynthesisVoice[] = [];

  // Web Audio API for subterranean cave reverberation and water drips
  private audioCtx: AudioContext | null = null;
  private dripInterval: number | null = null;

  constructor() {
    this.initAudioElement();
    this.initVoiceCache();
  }

  private initVoiceCache() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  private getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const live = window.speechSynthesis.getVoices();
      if (live && live.length > 0) {
        this.cachedVoices = live;
        return live;
      }
    }
    return this.cachedVoices;
  }

  private initAudioElement() {
    if (typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.preload = 'auto';

      this.audioEl.addEventListener('timeupdate', () => {
        if (this.audioEl && !this.isPlayingTtsStream) {
          this.state.currentTime = this.audioEl.currentTime;
          this.state.duration = this.audioEl.duration || this.state.duration;
          this.notify();
        }
      });

      this.audioEl.addEventListener('ended', () => {
        if (!this.isPlayingTtsStream) {
          this.handleTrackCompleted();
        }
      });

      this.audioEl.addEventListener('error', () => {
        if (!this.isPlayingTtsStream) {
          console.warn('Audio file error, falling back to speech or TTS stream');
        }
      });
    }
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copy = { ...this.state };
    this.listeners.forEach(fn => fn(copy));
  }

  public getState(): AudioPlaybackState {
    return { ...this.state };
  }

  /**
   * Automatic activation trigger by Beacon or GPS
   * Enforces 2-sec confirmation, anti-duplicate & 20-sec cooldown
   */
  public triggerAutomaticPoint(point: TourPoint, lang: LanguageCode) {
    if (!this.state.autoplayEnabled) return;
    if (this.state.status === 'COOLDOWN') return;

    // Check anti-duplicate: already played or currently playing this point?
    const progress = StorageService.getVisitorProgress();
    if (progress.visitedPointIds.includes(point.id) && this.state.currentPointId === point.id) {
      return;
    }

    if (this.state.currentPointId === point.id && this.state.isPlaying) {
      return;
    }

    // Enter CONFIRMING state for 2 seconds
    this.clearTimers();
    this.state.currentPointId = point.id;
    this.state.status = 'CONFIRMING';
    this.state.confirmingCountdown = 2;
    this.notify();

    let remaining = 2;
    const interval = window.setInterval(() => {
      remaining -= 1;
      this.state.confirmingCountdown = Math.max(0, remaining);
      this.notify();
      if (remaining <= 0) {
        window.clearInterval(interval);
        this.playPoint(point, lang, false);
      }
    }, 1000);
  }

  /**
   * Play or restart a point narration (manual or confirmed auto)
   */
  public playPoint(point: TourPoint, lang: LanguageCode, manual = true) {
    this.clearTimers();

    const translation = point.translations[lang] || point.translations['es'];
    const textToNarrate = `${translation.title}. ${translation.subtitle}. ${translation.description}`;

    this.state.currentPointId = point.id;
    this.state.status = 'PLAYING';
    this.state.isPlaying = true;
    this.state.currentTime = 0;
    this.state.duration = point.durationSeconds || Math.max(25, Math.ceil(textToNarrate.length / 15));
    this.notify();

    // Mark visited in storage and track analytics
    StorageService.markPointVisited(point.id);
    StorageService.trackEvent(manual ? 'point_audio_replayed' : 'point_audio_started', {
      pointId: point.id,
      language: lang,
      activationMethod: manual ? 'manual' : point.activation.primary,
    });

    // Check if custom audioUrl is present
    if (translation.audioUrl && translation.audioUrl.trim().length > 0) {
      if (this.audioEl) {
        this.audioEl.src = translation.audioUrl;
        this.audioEl.volume = this.state.volume;
        this.audioEl.playbackRate = this.state.playbackRate;
        this.audioEl.play().catch(() => {
          this.speakSyntheticText(textToNarrate, lang);
        });
      }
    } else {
      // Use high quality Web Speech API
      this.speakSyntheticText(textToNarrate, lang);
    }

    // Start progress clock
    this.startProgressClock();
  }

  private playChimeFeedback() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch {
      // AudioContext not allowed or not supported; gracefully continue
    }
  }

  private speakSyntheticText(text: string, lang: LanguageCode) {
    if (typeof window === 'undefined') {
      return;
    }

    this.playChimeFeedback();

    const langCodes: Record<LanguageCode, string> = {
      es: 'es-ES',
      en: 'en-US',
      de: 'de-DE',
      fr: 'fr-FR',
      it: 'it-IT',
      nl: 'nl-NL',
      pt: 'pt-PT',
      ru: 'ru-RU',
      pl: 'pl-PL',
      cs: 'cs-CZ',
      ro: 'ro-RO',
      zh: 'zh-CN',
      ja: 'ja-JP',
      ar: 'ar-SA',
    };

    const targetLangCode = langCodes[lang] || 'es-ES';
    const langPrefix = lang.toLowerCase();

    // Check if browser has speech synthesis
    if (!('speechSynthesis' in window)) {
      this.playTtsStream(text, lang);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      // ignore
    }

    const voices = this.getAvailableVoices();
    const matchingVoice = voices.find(v => {
      const code = v.lang.toLowerCase().replace('_', '-');
      return (
        code === targetLangCode.toLowerCase() ||
        code.startsWith(langPrefix) ||
        (langPrefix === 'ar' && (v.name.toLowerCase().includes('arabic') || v.name.includes('العربية') || v.lang.toLowerCase().includes('ar')))
      );
    });

    // If language is Arabic and no voice is found in the client OS, use stream immediately
    if (lang === 'ar' && !matchingVoice) {
      console.log('No native Arabic voice found in browser, using high-definition Arabic TTS stream');
      this.playTtsStream(text, lang);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.speechUtterance = utterance;
    utterance.lang = matchingVoice?.lang || targetLangCode;
    utterance.rate = this.state.playbackRate;
    utterance.volume = this.state.volume;

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      this.handleTrackCompleted();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error/stopped, falling back to TTS stream', e);
      // Immediately fallback to online TTS stream if synthesis fails
      this.playTtsStream(text, lang);
    };

    try {
      window.speechSynthesis.speak(utterance);

      // Keep voice alive if browser tries to pause immediately (Chrome bug)
      setTimeout(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 60);
    } catch (e) {
      console.warn('Speech synthesis call failed, using TTS stream', e);
      this.playTtsStream(text, lang);
    }
  }

  /**
   * Universal sentence-chunker for web TTS streaming (e.g. Google TTS API)
   * Splits long text into natural pauses under 160 chars
   */
  private splitTextIntoTtsChunks(text: string): string[] {
    const sentences = text.split(/(?<=[.!?؟،\n])\s+/);
    const chunks: string[] = [];
    let current = '';

    for (const s of sentences) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      if ((current + ' ' + trimmed).trim().length <= 150) {
        current = (current + ' ' + trimmed).trim();
      } else {
        if (current) chunks.push(current);
        if (trimmed.length > 150) {
          const words = trimmed.split(' ');
          let sub = '';
          for (const w of words) {
            if ((sub + ' ' + w).trim().length <= 150) {
              sub = (sub + ' ' + w).trim();
            } else {
              if (sub) chunks.push(sub);
              sub = w;
            }
          }
          if (sub) chunks.push(sub);
          current = '';
        } else {
          current = trimmed;
        }
      }
    }
    if (current) chunks.push(current);
    return chunks.length > 0 ? chunks : [text.slice(0, 150)];
  }

  /**
   * Plays text using an online high-definition audio TTS stream
   * Especially critical for Arabic when the visitor's device has no local Arabic TTS engine
   */
  public playTtsStream(text: string, lang: LanguageCode) {
    if (typeof window === 'undefined') return;
    this.isPlayingTtsStream = true;
    this.currentStreamLang = lang;
    this.ttsQueue = this.splitTextIntoTtsChunks(text);
    this.currentTtsIndex = 0;
    this.playNextTtsChunk();
  }

  private playNextTtsChunk() {
    if (!this.isPlayingTtsStream) return;
    if (this.currentTtsIndex >= this.ttsQueue.length) {
      this.isPlayingTtsStream = false;
      this.handleTrackCompleted();
      return;
    }

    const chunk = this.ttsQueue[this.currentTtsIndex];
    const langCode = this.currentStreamLang === 'ar' ? 'ar' : this.currentStreamLang;
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(chunk)}`;

    if (!this.audioEl) {
      this.audioEl = new Audio();
    }

    this.audioEl.src = url;
    this.audioEl.volume = this.state.volume;
    this.audioEl.playbackRate = this.state.playbackRate;

    const onChunkEnded = () => {
      this.currentTtsIndex++;
      this.playNextTtsChunk();
    };

    const onChunkError = () => {
      console.warn('TTS stream chunk failed, proceeding to next');
      this.currentTtsIndex++;
      if (this.currentTtsIndex < this.ttsQueue.length) {
        this.playNextTtsChunk();
      } else {
        this.isPlayingTtsStream = false;
        this.handleTrackCompleted();
      }
    };

    this.audioEl.onended = onChunkEnded;
    this.audioEl.onerror = onChunkError;

    this.audioEl.play().catch(e => {
      console.warn('TTS audio chunk playback prevented:', e);
      onChunkError();
    });
  }

  /**
   * Preview a voice sample for a language (used in LanguageModal & AudioManager)
   * Plays genuine Arabic or target language voice seamlessly
   */
  public previewVoiceSample(lang: LanguageCode, customText?: string): void {
    const sampleTexts: Record<LanguageCode, string> = {
      es: 'Bienvenidos a la Cueva de Can Marçà en Ibiza.',
      en: 'Welcome to Can Marçà Cave in Ibiza.',
      de: 'Willkommen in der Höhle von Can Marçà auf Ibiza.',
      fr: 'Bienvenue à la Grotte de Can Marçà à Ibiza.',
      it: 'Benvenuti alla Grotta di Can Marçà a Ibiza.',
      nl: 'Welkom bij de Grot van Can Marçà op Ibiza.',
      pt: 'Bem-vindos à Gruta de Can Marçà em Ibiza.',
      ru: 'Добро пожаловать в пещеру Кан Марса на Ибице.',
      pl: 'Witamy w jaskini Can Marçà na Ibizie.',
      cs: 'Vítejte v jeskyni Can Marçà na Ibize.',
      ro: 'Bun venit la Peștera Can Marçà din Ibiza.',
      zh: '欢迎来到伊比萨岛的卡恩·马尔萨洞穴。',
      ja: 'イビサ島のカン・マルサ洞窟へようこそ。',
      ar: 'مرحبًا بكم في كهف كان مارسا في إيبيزا.',
    };

    const text = customText || sampleTexts[lang] || sampleTexts.es;
    const voices = this.getAvailableVoices();
    const langPrefix = lang.toLowerCase();
    const matching = voices.find(v =>
      v.lang.toLowerCase().startsWith(langPrefix) ||
      (langPrefix === 'ar' && (v.name.toLowerCase().includes('arabic') || v.name.includes('العربية') || v.lang.toLowerCase().includes('ar')))
    );

    // If Arabic and no voice is in client browser, use direct web TTS audio element
    if (lang === 'ar' && !matching) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(text)}`;
      const sampleAudio = new Audio(url);
      sampleAudio.volume = this.state.volume;
      sampleAudio.play().catch(e => console.warn('Sample audio play error:', e));
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
      const utt = new SpeechSynthesisUtterance(text);
      if (matching) {
        utt.voice = matching;
      }
      utt.lang = matching?.lang || (lang === 'ar' ? 'ar-SA' : 'es-ES');
      utt.onerror = () => {
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
        const sampleAudio = new Audio(url);
        sampleAudio.volume = this.state.volume;
        sampleAudio.play().catch(() => {});
      };
      window.speechSynthesis.speak(utt);
    }
  }

  private startProgressClock() {
    if (this.progressInterval) {
      window.clearInterval(this.progressInterval);
    }

    this.progressInterval = window.setInterval(() => {
      if (this.state.isPlaying && this.state.status === 'PLAYING') {
        const nextTime = this.state.currentTime + 0.5 * this.state.playbackRate;
        if (nextTime >= this.state.duration) {
          this.state.currentTime = this.state.duration;
          this.handleTrackCompleted();
        } else {
          this.state.currentTime = nextTime;
          this.notify();
        }
      }
    }, 500);
  }

  public togglePlayPause() {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public pause() {
    this.state.isPlaying = false;
    this.state.status = 'PAUSED';
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.notify();
  }

  public resume() {
    this.state.isPlaying = true;
    this.state.status = 'PLAYING';
    if (this.audioEl && this.audioEl.src) {
      this.audioEl.play().catch(() => {});
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.notify();
  }

  public seek(seconds: number) {
    this.state.currentTime = Math.min(Math.max(0, seconds), this.state.duration);
    if (this.audioEl && this.audioEl.src) {
      this.audioEl.currentTime = this.state.currentTime;
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.state.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.state.volume;
    }
    this.notify();
  }

  public setPlaybackRate(rate: number) {
    this.state.playbackRate = rate;
    if (this.audioEl) {
      this.audioEl.playbackRate = rate;
    }
    this.notify();
  }

  public setAutoplay(enabled: boolean) {
    this.state.autoplayEnabled = enabled;
    this.notify();
  }

  private handleTrackCompleted() {
    if (this.progressInterval) {
      window.clearInterval(this.progressInterval);
    }
    this.state.isPlaying = false;
    this.state.status = 'COMPLETED';
    this.state.currentTime = this.state.duration;
    this.notify();

    if (this.state.currentPointId) {
      StorageService.trackEvent('point_audio_completed', {
        pointId: this.state.currentPointId,
      });
    }

    // Trigger 20-second cooldown
    this.startCooldown(20);
  }

  private startCooldown(seconds = 20) {
    this.state.status = 'COOLDOWN';
    this.state.cooldownRemaining = seconds;
    this.notify();

    if (this.cooldownInterval) {
      window.clearInterval(this.cooldownInterval);
    }

    this.cooldownInterval = window.setInterval(() => {
      this.state.cooldownRemaining -= 1;
      if (this.state.cooldownRemaining <= 0) {
        window.clearInterval(this.cooldownInterval!);
        this.cooldownInterval = null;
        this.state.status = 'IDLE';
        this.state.cooldownRemaining = 0;
      }
      this.notify();
    }, 1000);
  }

  public stop() {
    this.clearTimers();
    this.isPlayingTtsStream = false;
    this.ttsQueue = [];
    this.currentTtsIndex = 0;
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.state.isPlaying = false;
    this.state.status = 'IDLE';
    this.state.currentTime = 0;
    this.notify();
  }

  private clearTimers() {
    if (this.progressInterval) {
      window.clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.cooldownInterval) {
      window.clearInterval(this.cooldownInterval);
      this.cooldownInterval = null;
    }
    if (this.confirmationTimeout) {
      window.clearTimeout(this.confirmationTimeout);
      this.confirmationTimeout = null;
    }
  }

  /**
   * Atmospheric Cave Audio Generator:
   * Generates realistic subterranean water dripping and low cave acoustic resonances
   * using Web Audio API nodes. Completely self-contained and works 100% offline!
   */
  public toggleAmbientCaveSound(): boolean {
    const nextState = !this.state.ambientCaveSound;
    this.state.ambientCaveSound = nextState;

    if (nextState) {
      this.startCaveAmbience();
    } else {
      this.stopCaveAmbience();
    }

    this.notify();
    return nextState;
  }

  private startCaveAmbience() {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Cave drone oscillator (very low subterranean frequency ~55Hz with low-pass filter)
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, this.audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();

      // Generative water drips every 2-4 seconds
      this.dripInterval = window.setInterval(() => {
        if (!this.state.ambientCaveSound || !this.audioCtx) return;
        this.playWaterDrip();
      }, 2600);
    } catch (e) {
      console.warn('Cave ambient audio initialization note:', e);
    }
  }

  private playWaterDrip() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') return;
    try {
      const now = this.audioCtx.currentTime;
      const dripOsc = this.audioCtx.createOscillator();
      const dripGain = this.audioCtx.createGain();

      const baseFreq = 800 + Math.random() * 400; // 800Hz - 1200Hz drop sound
      dripOsc.type = 'sine';
      dripOsc.frequency.setValueAtTime(baseFreq, now);
      dripOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

      dripGain.gain.setValueAtTime(0.03, now);
      dripGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      dripOsc.connect(dripGain);
      dripGain.connect(this.audioCtx.destination);

      dripOsc.start(now);
      dripOsc.stop(now + 0.3);
    } catch (e) {
      // ignore
    }
  }

  private stopCaveAmbience() {
    if (this.dripInterval) {
      window.clearInterval(this.dripInterval);
      this.dripInterval = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch (e) {
        // ignore
      }
      this.audioCtx = null;
    }
  }
}

export const audioEngine = new AudioEngine();
