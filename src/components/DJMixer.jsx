import React, { useState, useRef, useEffect } from 'react';
import './DJMixer.css';

const DJMixer = ({ tracks }) => {
  // Deck A state
  const [deckATrackIndex, setDeckATrackIndex] = useState(0);
  const [deckAPlaying, setDeckAPlaying] = useState(false);
  const [deckATime, setDeckATime] = useState(0);
  const [deckADuration, setDeckADuration] = useState(0);
  const [deckAVolume, setDeckAVolume] = useState(1);
  const audioRefA = useRef(null);

  // Deck B state
  const [deckBTrackIndex, setDeckBTrackIndex] = useState(1);
  const [deckBPlaying, setDeckBPlaying] = useState(false);
  const [deckBTime, setDeckBTime] = useState(0);
  const [deckBDuration, setDeckBDuration] = useState(0);
  const [deckBVolume, setDeckBVolume] = useState(1);
  const audioRefB = useRef(null);

  // Mixer state
  const [crossfader, setCrossfader] = useState(0.5); // 0 = full A, 1 = full B

  // Calculate effective volumes based on crossfader
  const getEffectiveVolume = (deckVolume, isDeckA) => {
    const crossfadeMultiplier = isDeckA
      ? Math.cos(crossfader * Math.PI / 2)
      : Math.sin(crossfader * Math.PI / 2);
    return deckVolume * crossfadeMultiplier;
  };

  // Update audio volumes when crossfader or deck volumes change
  useEffect(() => {
    if (audioRefA.current) {
      audioRefA.current.volume = getEffectiveVolume(deckAVolume, true);
    }
  }, [crossfader, deckAVolume]);

  useEffect(() => {
    if (audioRefB.current) {
      audioRefB.current.volume = getEffectiveVolume(deckBVolume, false);
    }
  }, [crossfader, deckBVolume]);

  // Deck A audio handlers
  useEffect(() => {
    const audio = audioRefA.current;
    if (!audio) return;

    const updateTime = () => setDeckATime(audio.currentTime);
    const updateDuration = () => setDeckADuration(audio.duration);
    const handleEnded = () => setDeckAPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [deckATrackIndex]);

  // Deck B audio handlers
  useEffect(() => {
    const audio = audioRefB.current;
    if (!audio) return;

    const updateTime = () => setDeckBTime(audio.currentTime);
    const updateDuration = () => setDeckBDuration(audio.duration);
    const handleEnded = () => setDeckBPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [deckBTrackIndex]);

  // Play/pause handlers
  useEffect(() => {
    if (audioRefA.current) {
      if (deckAPlaying) {
        audioRefA.current.play();
      } else {
        audioRefA.current.pause();
      }
    }
  }, [deckAPlaying, deckATrackIndex]);

  useEffect(() => {
    if (audioRefB.current) {
      if (deckBPlaying) {
        audioRefB.current.play();
      } else {
        audioRefB.current.pause();
      }
    }
  }, [deckBPlaying, deckBTrackIndex]);

  // Restart track function
  const restartTrack = (audioRef, setTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setTime(0);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderDeck = (deckName, trackIndex, setTrackIndex, isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, volume, setVolume, audioRef) => {
    const track = tracks[trackIndex];
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div className={`deck deck-${deckName.toLowerCase()}`}>
        <div className="deck-header">
          <span className="deck-label">{deckName}</span>
        </div>

        {/* Track selector */}
        <div className="track-selector">
          <select
            value={trackIndex}
            onChange={(e) => {
              setTrackIndex(Number(e.target.value));
              setIsPlaying(false);
            }}
          >
            {tracks.map((t, i) => (
              <option key={i} value={i}>{t.title}</option>
            ))}
          </select>
        </div>

        {/* Vinyl/Waveform display */}
        <div className={`vinyl ${isPlaying ? 'spinning' : ''}`}>
          <div className="vinyl-label">X</div>
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div
            className="progress-bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              if (audioRef.current) {
                audioRef.current.currentTime = percent * duration;
              }
            }}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="deck-controls">
          {/* Restart button */}
          <button
            className="control-btn restart-btn"
            onClick={() => restartTrack(audioRef, setCurrentTime)}
            title="Restart track"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play/Pause button */}
          <button
            className={`play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Volume slider */}
        <div className="volume-control">
          <span className="volume-label">VOL</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="volume-slider"
          />
          <span className="volume-value">{Math.round(volume * 100)}</span>
        </div>

        <audio ref={audioRef} src={track.file} preload="metadata" />
      </div>
    );
  };

  return (
    <div className="dj-mixer">
      {/* Deck A */}
      {renderDeck('A', deckATrackIndex, setDeckATrackIndex, deckAPlaying, setDeckAPlaying, deckATime, setDeckATime, deckADuration, deckAVolume, setDeckAVolume, audioRefA)}

      {/* Mixer Center */}
      <div className="mixer-center">
        <div className="mixer-header">
          <span>MIXER</span>
        </div>

        {/* Crossfader */}
        <div className="crossfader-container">
          <span className="cf-label">A</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={crossfader}
            onChange={(e) => setCrossfader(Number(e.target.value))}
            className="crossfader"
          />
          <span className="cf-label">B</span>
        </div>

        {/* Visual indicator */}
        <div className="mix-indicator">
          <div className="mix-bar">
            <div className="mix-a" style={{ width: `${(1 - crossfader) * 100}%` }} />
            <div className="mix-b" style={{ width: `${crossfader * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Deck B */}
      {renderDeck('B', deckBTrackIndex, setDeckBTrackIndex, deckBPlaying, setDeckBPlaying, deckBTime, setDeckBTime, deckBDuration, deckBVolume, setDeckBVolume, audioRefB)}
    </div>
  );
};

export default DJMixer;
