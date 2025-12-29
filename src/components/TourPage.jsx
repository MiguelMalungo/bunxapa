import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './TourPage.css';

const TourPage = () => {
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const audioRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const tourDates = [
    { date: 'JAN 15', venue: 'The Warehouse', location: 'Los Angeles, CA' },
    { date: 'JAN 22', venue: 'Electric Garden', location: 'Brooklyn, NY' },
    { date: 'FEB 03', venue: 'Sonic Temple', location: 'Chicago, IL' },
    { date: 'FEB 10', venue: 'Bass Cathedral', location: 'Austin, TX' },
    { date: 'FEB 17', venue: 'Neon Underground', location: 'Miami, FL' },
    { date: 'MAR 01', venue: 'The Pulse', location: 'San Francisco, CA' },
    { date: 'MAR 08', venue: 'Sound Vault', location: 'Seattle, WA' },
    { date: 'MAR 15', venue: 'Echo Chamber', location: 'Denver, CO' },
    { date: 'MAR 22', venue: 'Frequency Hall', location: 'Portland, OR' },
    { date: 'APR 05', venue: 'Bass District', location: 'Detroit, MI' },
    { date: 'APR 12', venue: 'The Grid', location: 'Atlanta, GA' },
    { date: 'APR 19', venue: 'Pulse Point', location: 'Nashville, TN' }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.5;
    }

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !audio.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="tour-page">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="tour-video"
        autoPlay
        loop
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.target.playbackRate = 0.5;
        }}
      >
        <source src={`${import.meta.env.BASE_URL}VIDEOTOUR.mp4`} type="video/mp4" />
      </video>

      {/* Background Audio */}
      <audio
        ref={audioRef}
        autoPlay
        loop
        muted={isMuted}
      >
        <source src={`${import.meta.env.BASE_URL}Blop.mp3`} type="audio/mpeg" />
      </audio>

      {/* Header blur band */}
      <div className={`tour-header-band ${isScrolled ? 'scrolled' : ''}`}></div>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        <Link to="/" className="nav-link">HOME</Link>
        <Link to="/tour" className="nav-link active">DATES</Link>
        <Link to="/listen" className="nav-link">LISTEN</Link>
        <Link to="/shop" className="nav-link">SHOP</Link>
      </nav>

      {/* Tour Dates Container */}
      <div className="tour-dates-container">
        {tourDates.map((show, index) => (
          <Link
            to="/tour"
            key={index}
            className="tour-date-item"
          >
            <span className="tour-date">{show.date}</span>
            <span className="tour-venue">{show.venue}</span>
            <span className="tour-location">{show.location}</span>
          </Link>
        ))}
      </div>

      {/* Sound Control Icon */}
      <button className="sound-control" onClick={toggleMute} aria-label="Toggle sound">
        {isMuted ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>

      {/* Footer */}
      <footer className="tour-footer">
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
  );
};

export default TourPage;
