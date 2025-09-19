import React, { useMemo } from 'react';

export default function ResultScreen({ results, onRestart, onReplay }) {
  const total = results.length;
  const correctCount = useMemo(() => results.filter(r => r.correct).length, [results]);
  const scorePct = Math.round((correctCount / Math.max(1, total)) * 100);

  return (
    <section className="bg-white/85 rounded-2xl shadow-sm p-5 sm:p-8 backdrop-blur">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-700">Resultados</h2>
        <p className="text-purple-700/80 mt-2">
          Puntaje: <span className="font-semibold">{correctCount} / {total}</span> ({scorePct}%)
        </p>
      </div>

      <ul className="space-y-3 mb-6">
        {results.map((r, i) => (
          <li
            key={`${r.song.path}-${i}`}
            className={`rounded-xl border p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2
              ${r.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
          >
            <div>
              <p className="text-sm text-purple-800">
                <span className="font-semibold">{i + 1}.</span> {r.song.name}
              </p>
              <p className="text-xs text-purple-700/80">
                {r.correct ? '¡Correcto!' : `Elegiste: ${r.selectedArtist}`}
              </p>
            </div>
            <div className="text-sm">
              <span className="font-medium text-purple-800">Artista:</span>{' '}
              <span className="text-purple-700">{r.correctArtist}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReplay}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold shadow hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-purple-300 active:scale-[0.99]"
        >
          Repetir con mismas opciones
        </button>
        <button
          onClick={onRestart}
          className="px-5 py-2 rounded-xl bg-yellow-400 text-white font-semibold shadow hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 active:scale-[0.99]"
        >
          Volver al inicio
        </button>
      </div>
    </section>
  );
}
