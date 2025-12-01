import React, { useState, useRef, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const bottomVideoRef = useRef(null);

  const tracks = [
    { title: 'Blop', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Blop.mp3` },
    { title: 'Release', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Release.mp3` },
    { title: 'Closing', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Closing.mp3` }
  ];

  const currentTrack = tracks[currentTrackIndex];

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const video = bottomVideoRef.current;
    const container = video?.parentElement;
    
    if (video && container) {
      video.playbackRate = 0.3;
      
      const updateContainerHeight = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const aspectRatio = video.videoHeight / video.videoWidth;
          const containerWidth = container.offsetWidth || window.innerWidth;
          const containerHeight = containerWidth * aspectRatio;
          container.style.height = `${containerHeight}px`;
        }
      };
      
      const handleLoadedMetadata = () => {
        video.playbackRate = 0.3;
        updateContainerHeight();
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // Update on window resize
      const handleResize = () => {
        updateContainerHeight();
      };
      window.addEventListener('resize', handleResize);
      
      // Try immediately in case metadata is already loaded
      if (video.readyState >= 1) {
        video.playbackRate = 0.3;
        updateContainerHeight();
      }
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const remainingTime = duration - currentTime;

  return (
    <div className="landing-page">
      {/* Background Image Container */}
      <div className="background-image">
        <img src={`${import.meta.env.BASE_URL}artwork.png`} alt="BUNXAPA Artwork" />

        {/* Section 1: Navigation Menu - Top */}
        <nav className="nav-menu">
          <a href="#home" className="nav-link">HOME</a>
          <a href="#dates" className="nav-link">DATES</a>
          <a href="#listen" className="nav-link">LISTEN</a>
          <a href="#shop" className="nav-link">SHOP</a>
        </nav>

        {/* Section 5: Action Icons - Left Vertical */}
        <div className="action-icons">
          <button className="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
          <button className="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <button className="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </button>
          <button className="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>
        </div>

        {/* Section 3: Tour Dates - Top Right */}
        <div className="tour-dates">
          <h3 className="tour-dates-title">TOUR DATES</h3>
          <div className="tour-date-item">
            <div className="date">DEC 15</div>
            <div className="venue">LISBON</div>
          </div>
          <div className="tour-date-item">
            <div className="date">DEC 22</div>
            <div className="venue">PORTO</div>
          </div>
          <div className="tour-date-item">
            <div className="date">JAN 05</div>
            <div className="venue">COIMBRA</div>
          </div>
          <div className="tour-date-item">
            <div className="date">JAN 18</div>
            <div className="venue">BRAGA</div>
          </div>
          <div className="tour-date-item">
            <div className="date">FEB 02</div>
            <div className="venue">AVEIRO</div>
          </div>
          <div className="tour-date-item">
            <div className="date">FEB 14</div>
            <div className="venue">FARO</div>
          </div>
          <div className="tour-date-item">
            <div className="date">MAR 08</div>
            <div className="venue">ÉVORA</div>
          </div>
          <div className="tour-date-item">
            <div className="date">MAR 22</div>
            <div className="venue">LEIRIA</div>
          </div>
          <div className="tour-date-item">
            <div className="date">APR 05</div>
            <div className="venue">VISEU</div>
          </div>
          <div className="tour-date-item">
            <div className="date">APR 20</div>
            <div className="venue">SETÚBAL</div>
          </div>
        </div>

        {/* Section 4: Music Player - Bottom */}
        <div className="music-player">
          <audio ref={audioRef} src={currentTrack.file} />
          <div className="track-info">
            <div className="track-title">{currentTrack.title}</div>
            <div className="artist-name">{currentTrack.artist}</div>
          </div>
          <div className="player-controls">
            <div className="progress-bar">
              <div className="time">{formatTime(currentTime)}</div>
              <div className="progress">
                <div className="progress-filled" style={{width: `${progressPercent}%`}}></div>
              </div>
              <div className="time">-{formatTime(remainingTime)}</div>
            </div>
            <div className="control-buttons">
              <button className="control-btn" onClick={prevTrack}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button className="control-btn play-btn" onClick={togglePlay}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <button className="control-btn" onClick={nextTrack}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Social Media Icons - Right Fixed */}
        <div className="social-icons">
        <a href="#instagram" className="social-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="#twitter" className="social-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>
        <a href="#spotify" className="social-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </a>
        <a href="#youtube" className="social-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        </div>
      </div>

      {/* Bottom Section: Text + Video Overlay */}
      <div className="bottom-section">
        <h1 className="bottom-text">
          BUN<span className="x-letter">X</span>APA
        </h1>
        <video 
          ref={bottomVideoRef}
          className="bottom-video" 
          autoPlay 
          loop 
          muted 
          playsInline
          onLoadedMetadata={(e) => {
            e.target.playbackRate = 0.3;
          }}
        >
          <source src={`${import.meta.env.BASE_URL}bottom.mp4`} type="video/mp4" />
        </video>
        
        {/* Footer */}
        <footer className="bottom-footer">
          <div className="footer-content">
            <div className="footer-right">
              Created by <span className="footer-author">DIGISOL</span>
              <img 
                src={`${import.meta.env.BASE_URL}logodigi.png`} 
                alt="DIGISOL Logo" 
                className="footer-logo"
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
