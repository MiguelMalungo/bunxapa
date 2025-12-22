import React, { useState, useRef, useEffect } from 'react';
import { Howl, Howler } from 'howler';
import './DJMixer.css';

const DJMixer = ({ tracks }) => {
  // Deck A state
  const [deckATrackIndex, setDeckATrackIndex] = useState(0);
  const [deckAPlaying, setDeckAPlaying] = useState(false);
  const [deckATime, setDeckATime] = useState(0);
  const [deckADuration, setDeckADuration] = useState(0);
  const [deckAVolume, setDeckAVolume] = useState(1);
  const howlRefA = useRef(null);

  // Deck B state
  const [deckBTrackIndex, setDeckBTrackIndex] = useState(1);
  const [deckBPlaying, setDeckBPlaying] = useState(false);
  const [deckBTime, setDeckBTime] = useState(0);
  const [deckBDuration, setDeckBDuration] = useState(0);
  const [deckBVolume, setDeckBVolume] = useState(1);
  const howlRefB = useRef(null);

  // Animation frame refs for smooth progress updates
  const rafRefA = useRef(null);
  const rafRefB = useRef(null);

  // Mixer state
  const [crossfader, setCrossfader] = useState(0.5); // 0 = full A, 1 = full B

  // Detect iOS device - needs html5: true for loudspeaker audio in Safari/Chrome
  // Google Search App (GSA) works fine with Web Audio API
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isGoogleApp = /GSA/i.test(navigator.userAgent);
  const needsHTML5Audio = isIOS && !isGoogleApp;

  // Calculate effective volumes based on crossfader
  const getEffectiveVolume = (deckVolume, isDeckA) => {
    let crossfadeMultiplier;
    if (isDeckA) {
      // Deck A: full volume at 0, muted at 1
      crossfadeMultiplier = 1 - crossfader;
    } else {
      // Deck B: muted at 0, full volume at 1
      crossfadeMultiplier = crossfader;
    }
    const effectiveVolume = deckVolume * crossfadeMultiplier;
    // Howler handles 0 volume correctly
    return effectiveVolume;
  };

  // Update volumes when crossfader or deck volumes change
  useEffect(() => {
    if (howlRefA.current) {
      const volume = getEffectiveVolume(deckAVolume, true);
      howlRefA.current.volume(volume);
    }
    if (howlRefB.current) {
      const volume = getEffectiveVolume(deckBVolume, false);
      howlRefB.current.volume(volume);
    }
  }, [crossfader, deckAVolume, deckBVolume]);

  // Cleanup helper
  const unloadDeck = (howlRef, rafRef) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }
  };

  // Helper to init/load track
  const loadTrack = (trackIndex, isDeckA) => {
    const track = tracks[trackIndex];
    if (!track) return;

    // Determine references based on deck
    const howlRef = isDeckA ? howlRefA : howlRefB;
    const rafRef = isDeckA ? rafRefA : rafRefB;
    const setTime = isDeckA ? setDeckATime : setDeckBTime;
    const setDuration = isDeckA ? setDeckADuration : setDeckBDuration;
    const setPlaying = isDeckA ? setDeckAPlaying : setDeckBPlaying;
    const deckVolume = isDeckA ? deckAVolume : deckBVolume;

    // Unload previous
    unloadDeck(howlRef, rafRef);

    // Create new Howl
    // iOS Safari/Chrome need html5: true for loudspeaker (receiver speaker issue)
    // Google app and desktop use Web Audio API (html5: false) for better mixing
    // Howler's .volume() works with both modes
    howlRef.current = new Howl({
      src: [track.file],
      html5: needsHTML5Audio,
      volume: getEffectiveVolume(deckVolume, isDeckA),
      onplay: () => {
        setPlaying(true);
        // Start progress loop
        const step = () => {
          if (howlRef.current && howlRef.current.playing()) {
            setTime(howlRef.current.seek());
            rafRef.current = requestAnimationFrame(step);
          }
        };
        rafRef.current = requestAnimationFrame(step);
      },
      onpause: () => {
        setPlaying(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      },
      onstop: () => {
        setPlaying(false);
        setTime(0);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      },
      onend: () => {
        setPlaying(false);
        setTime(0); // Optional: reset to start
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      },
      onload: () => {
        setDuration(howlRef.current.duration());
      },
      onloaderror: (id, err) => {
        console.error(`Error loading track ${track.title}:`, err);
      }
    });
  };

  // Deck A Load Effect
  useEffect(() => {
    loadTrack(deckATrackIndex, true);
    return () => unloadDeck(howlRefA, rafRefA);
  }, [deckATrackIndex]);

  // Deck B Load Effect
  useEffect(() => {
    loadTrack(deckBTrackIndex, false);
    return () => unloadDeck(howlRefB, rafRefB);
  }, [deckBTrackIndex]);

  // Global cleanup
  useEffect(() => {
    return () => {
      unloadDeck(howlRefA, rafRefA);
      unloadDeck(howlRefB, rafRefB);
    };
  }, []);

  // Play/Pause Deck A Control
  useEffect(() => {
    if (howlRefA.current) {
      if (deckAPlaying && !howlRefA.current.playing()) {
        howlRefA.current.play();
      } else if (!deckAPlaying && howlRefA.current.playing()) {
        howlRefA.current.pause();
      }
    }
  }, [deckAPlaying]);

  // Play/Pause Deck B Control
  useEffect(() => {
    if (howlRefB.current) {
      if (deckBPlaying && !howlRefB.current.playing()) {
        howlRefB.current.play();
      } else if (!deckBPlaying && howlRefB.current.playing()) {
        howlRefB.current.pause();
      }
    }
  }, [deckBPlaying]);


  const restartTrack = (howlRef, setTime) => {
    if (howlRef.current) {
      howlRef.current.stop(); // Stop resets position to 0
      howlRef.current.play(); // Restart immediately
      // Progress loop will restart via onplay
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderDeck = (deckName, trackIndex, setTrackIndex, isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, volume, setVolume, howlRef) => {
    const track = tracks[trackIndex];
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div
        className={`deck deck-${deckName.toLowerCase()}`}
      >


        {/* Track selector */}
        <div className="track-selector">
          <select
            value={trackIndex}
            onChange={(e) => {
              setTrackIndex(Number(e.target.value));
              // Auto-stop when changing track handled by effect cleanup/load
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
          <div className="vinyl-label">
            <span className="vinyl-label-desktop">X</span>
            <span className="vinyl-label-mobile">X</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div
            className="progress-bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              if (howlRef.current) {
                const newTime = percent * duration;
                howlRef.current.seek(newTime);
                setCurrentTime(newTime);
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
            onClick={() => restartTrack(howlRef, setCurrentTime)}
            title="Restart track"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play/Pause button */}
          <button
            className={`play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={() => {
              // Toggle state, effect handles actual logic
              setIsPlaying(!isPlaying);
            }}
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
            onChange={(e) => {
              setVolume(Number(e.target.value));
            }}
            className="volume-slider"
          />

        </div>
      </div>
    );
  };

  return (
    <div className="dj-mixer">
      {/* Deck A */}
      {renderDeck('A', deckATrackIndex, setDeckATrackIndex, deckAPlaying, setDeckAPlaying, deckATime, setDeckATime, deckADuration, deckAVolume, setDeckAVolume, howlRefA)}

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
            onInput={(e) => {
              setCrossfader(Number(e.target.value));
            }}
            onChange={(e) => {
              setCrossfader(Number(e.target.value));
            }}
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
      {renderDeck('B', deckBTrackIndex, setDeckBTrackIndex, deckBPlaying, setDeckBPlaying, deckBTime, setDeckBTime, deckBDuration, deckBVolume, setDeckBVolume, howlRefB)}
    </div>
  );
};

export default DJMixer;
