import React, { useEffect, useMemo, useRef, useState } from 'react';
import Controls from './Controls.jsx';
import OptionButton from './OptionButton.jsx';

export default function GameScreen({ songs, allArtists, randomStart, onFinish, onExit }) {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null); // selección previa
  const [confirmed, setConfirmed] = useState(false); // ya respondió
  const [feedback, setFeedback] = useState(null); // { correct, correctArtists, title }
  const [results, setResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // 50%

  const audioRef = useRef(null);
  const playTimerRef = useRef(null);

  const total = songs.length;
  const currentSong = songs[index];

  const uniqueArtists = useMemo(() => {
    const set = new Set(allArtists);
    return Array.from(set);
  }, [allArtists]);

  useEffect(() => {
    if (!currentSong) return;
    const correctArtists = Array.isArray(currentSong.artists) ? currentSong.artists : [];
    const opts = buildOptions(correctArtists, uniqueArtists, 10);
    setOptions(opts);
    setSelectedArtist(null);
    setConfirmed(false);
    setFeedback(null);
    setupAudio(currentSong);
    return () => {
      cleanupAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  function buildOptions(correctArtists, all, desiredCount) {
    const correctSet = new Set(correctArtists);
    const pool = all.filter(a => !correctSet.has(a));
    shuffleInPlace(pool);
    const needed = Math.max(0, desiredCount - correctArtists.length);
    const incorrects = pool.slice(0, needed);
    const combo = [...correctArtists, ...incorrects];
    shuffleInPlace(combo);
    return combo;
  }

  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function setupAudio(song) {
    cleanupAudio();

    const audio = new Audio();
    const src = song.path?.startsWith('/') ? song.path : `/${song.path}`;
    audio.src = src;
    audio.preload = 'auto';
    audio.volume = volume;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    const onLoadedMeta = () => {
      const duration = audio.duration || 0;
      let startTime = 0;
      if (randomStart && duration > 0) {
        const max = duration / 2;
        startTime = Math.random() * Math.max(0, max);
      }
      playTimerRef.current = setTimeout(async () => {
        try {
          audio.currentTime = Math.min(startTime, Math.max(0, audio.duration - 0.25));
        } catch {}
        try {
          await audio.play();
        } catch {}
      }, 1000);
    };

    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    audioRef.current = audio;
    audio.load();
  }

  function cleanupAudio() {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {}
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      audioRef.current = null;
    }
    setIsPlaying(false);
  }

  function handleTogglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }

  function handleConfirm() {
    if (!selectedArtist || confirmed) return;
    const correctArtists = Array.isArray(currentSong.artists) ? currentSong.artists : [];
    const correct = correctArtists.includes(selectedArtist);

    const entry = {
      song: currentSong,
      correct,
      selectedArtist,
      correctArtists,
    };
    setResults(prev => [...prev, entry]);
    setFeedback({
      correct,
      correctArtists,
      title: currentSong.name,
    });
    setConfirmed(true);
    // La canción sigue sonando; no se pausa al responder.
  }

  function handleNext() {
    if (index + 1 >= total) {
      onFinish(results);
    } else {
      setIndex(i => i + 1);
    }
  }

  const progressText = `${index + 1} / ${total}`;
  const canConfirm = !!selectedArtist && !confirmed;
  const correctArtistsSet = new Set(Array.isArray(currentSong?.artists) ? currentSong.artists : []);

  return (
    <section className="relative bg-white/85 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
            Ronda {progressText}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
            Volumen: {Math.round(volume * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Controls
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            volume={volume}
            onVolumeChange={(v) => setVolume(v)}
          />
          <button
            type="button"
            onClick={onExit}
            className="px-4 py-2 rounded-xl border border-pink-200 bg-white/70 text-pink-700 hover:bg-pink-50 shadow-sm"
            title="Volver al menú"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="rounded-xl border border-pink-200 bg-pink-50 text-pink-800 px-4 py-3">
          La canción se reproduce con 1s de delay. Elige un artista y pulsa “Seleccionar”.
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {options.map((artist, idx) => (
          <OptionButton
            key={`${artist}-${idx}`}
            label={artist}
            disabled={confirmed}
            selected={selectedArtist === artist}
            correct={confirmed && correctArtistsSet.has(artist)}
            onClick={() => setSelectedArtist(artist)}
          />
        ))}
      </div>

      <div className="mt-5 sm:mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`px-5 py-3 rounded-xl font-semibold shadow transition
            ${canConfirm
              ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:brightness-110 ring-2 ring-pink-200'
              : 'bg-purple-100 text-purple-400 cursor-not-allowed'}`}
        >
          Seleccionar
        </button>
      </div>

      {feedback && (
        <div className="mt-6">
          <div className={`rounded-xl px-4 py-4 shadow-sm border
            ${feedback.correct
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'}`}>
            <p className="font-semibold">
              {feedback.correct ? '¡Correcto!' : 'Incorrecto'}
            </p>
            <p className="text-sm mt-1 text-inherit">
              Título: <span className="font-medium">{feedback.title}</span>
            </p>
            {!feedback.correct && (
              <p className="text-sm mt-1">
                Respuesta correcta: <span className="font-medium">{feedback.correctArtists.join(', ')}</span>
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold shadow hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-purple-300 active:scale-[0.99]"
            >
              {index + 1 >= total ? 'Ver resultados' : 'Siguiente'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
