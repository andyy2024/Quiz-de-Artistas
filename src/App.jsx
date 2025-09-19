import React, { useEffect, useMemo, useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import GameScreen from './components/GameScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';

export default function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [view, setView] = useState('start'); // 'start' | 'game' | 'result'
  const [settings, setSettings] = useState({ count: 10, randomStart: false });
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadSongs() {
      try {
        const res = await fetch('/songs.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('No se pudo cargar songs.json');
        const data = await res.json();
        if (isMounted) {
          setSongs(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          setFetchError(e.message || 'Error al cargar canciones');
          setLoading(false);
        }
      }
    }
    loadSongs();
    return () => { isMounted = false; };
  }, []);

  const allArtists = useMemo(() => {
    const set = new Set();
    songs.forEach(s => {
      const list = Array.isArray(s.artists) ? s.artists : [];
      list.forEach(a => set.add(a));
    });
    return Array.from(set);
  }, [songs]);

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function handleStart(nextSettings) {
    const totalAvailable = songs.length;
    const count = Math.min(nextSettings.count, totalAvailable);
    const chosen = shuffle(songs).slice(0, count);
    setSettings(nextSettings);
    setSelectedSongs(chosen);
    setResults([]);
    setView('game');
  }

  function handleFinish(collectedResults) {
    setResults(collectedResults);
    setView('result');
  }

  function restart() {
    setView('start');
  }

  function replaySame() {
    handleStart(settings);
  }

  function exitToMenu() {
    setView('start');
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        <header className="text-center mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-700 drop-shadow-sm">
            Guess the Artist
          </h1>
          <p className="text-sm sm:text-base text-purple-600">
            Adivina el artista de cada canción. Colores pastel, vibes cute.
          </p>
        </header>

        {loading && (
          <div className="text-center text-purple-700 bg-white/70 rounded-xl p-6 shadow-sm">
            Cargando canciones...
          </div>
        )}

        {!loading && !fetchError && view === 'start' && (
          <StartScreen totalSongs={songs.length} onStart={handleStart} />
        )}

        {!loading && !fetchError && view === 'game' && (
          <GameScreen
            songs={selectedSongs}
            allArtists={allArtists}
            randomStart={settings.randomStart}
            onFinish={handleFinish}
            onExit={exitToMenu}
          />
        )}

        {!loading && !fetchError && view === 'result' && (
          <ResultScreen results={results} onRestart={restart} onReplay={replaySame} />
        )}

        {!loading && fetchError && (
          <div className="text-center text-red-600 bg-white/80 rounded-xl p-6 shadow-sm">
            {fetchError}
          </div>
        )}
      </div>
    </div>
  );
}
