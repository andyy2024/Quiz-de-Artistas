import React, { useState } from 'react';

export default function StartScreen({ totalSongs, onStart }) {
  const [count, setCount] = useState(10);
  const [randomStart, setRandomStart] = useState(false);

  const options = [10, 30, 50, 125];

  function handleSubmit(e) {
    e.preventDefault();
    onStart({ count, randomStart });
  }

  const cappedInfo = count > totalSongs ? ` (se usarán ${totalSongs} disponibles)` : '';

  return (
    <section className="bg-white/80 rounded-2xl shadow-sm p-5 sm:p-8 backdrop-blur">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-purple-700">Cómo funciona</h2>
        <p className="text-purple-700/80 mt-2">
          Sonará una canción al azar y tendrás que adivinar su artista entre 10 opciones
          (el correcto + 9 artistas al azar). La reproducción comienza tras 1 segundo.
          Al finalizar, verás tu puntaje y el detalle de aciertos y errores.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-pink-700 mb-2">Número de canciones</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {options.map(opt => (
              <label
                key={opt}
                className={`cursor-pointer rounded-xl border-2 p-3 text-center transition
                ${count === opt ? 'border-purple-500 bg-purple-50' : 'border-purple-200 bg-white hover:bg-purple-50'}`}
              >
                <input
                  type="radio"
                  name="count"
                  value={opt}
                  checked={count === opt}
                  onChange={() => setCount(opt)}
                  className="hidden"
                />
                <span className="block font-medium text-purple-700">{opt}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-purple-600 mt-2">
            Canciones disponibles: {totalSongs}. Seleccionado: {count}{cappedInfo}
          </p>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-pink-300 text-pink-500 focus:ring-pink-400"
              checked={randomStart}
              onChange={(e) => setRandomStart(e.target.checked)}
            />
            <span className="text-pink-700">
              Reproducir desde un punto aleatorio entre el inicio y la mitad
            </span>
          </label>
          <p className="text-xs text-pink-700/70 mt-1">
            Si no está marcado, las canciones suenan desde el principio.
          </p>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400
                     text-white font-bold shadow hover:brightness-105 focus:outline-none focus:ring-2
                     focus:ring-purple-300 active:scale-[0.99] transition"
        >
          ¡Comenzar!
        </button>
      </form>
    </section>
  );
}
