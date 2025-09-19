import React from 'react';

export default function Controls({ isPlaying, onTogglePlay, volume, onVolumeChange }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <button
        type="button"
        onClick={onTogglePlay}
        className={`px-4 py-2 rounded-xl font-semibold text-white shadow transition
          ${isPlaying ? 'bg-purple-500 hover:bg-purple-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
      >
        {isPlaying ? 'Pausar' : 'Reproducir'}
      </button>

      <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
        <span className="text-yellow-700 text-sm">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(volume * 100)}
          onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
          className="w-28 accent-pink-400"
          aria-label="Control de volumen"
        />
      </div>
    </div>
  );
}
