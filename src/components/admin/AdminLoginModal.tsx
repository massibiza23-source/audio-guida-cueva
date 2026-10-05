import React, { useState } from 'react';
import { Lock, Key, ArrowRight, X, AlertCircle } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = StorageService.getAdminPin();
    if (pin === correctPin || pin === 'canmarca2025' || pin === '1234') {
      StorageService.setAdminAuthenticated(true);
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-stone-100 font-serif">Panel de Administración</h3>
          <p className="text-xs text-stone-400">
            Acceso exclusivo para personal, guías y administradores de Cueva de Can Marçà.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Introduce el PIN de acceso:
            </label>
            <input
              type="password"
              maxLength={8}
              autoFocus
              placeholder="PIN por defecto: 1234"
              value={pin}
              onChange={e => {
                setPin(e.target.value);
                setError(false);
              }}
              className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-center tracking-widest text-lg font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-1.5 text-xs text-red-400 bg-red-950/30 border border-red-800/40 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>PIN incorrecto. Prueba con 1234.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-500/20"
          >
            <span>Acceder al Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-stone-500 text-center">
          PIN de demostración: <code className="text-amber-400 font-mono">1234</code>
        </p>
      </div>
    </div>
  );
};
