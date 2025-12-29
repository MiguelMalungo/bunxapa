import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListenPage.css';
import DJMixer from './DJMixer';

const ListenPage = () => {
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const navRef = useRef(null);
  const mixerRef = useRef(null);
  const footerRef = useRef(null);

  const tracks = [
    { title: 'Echoes Extend', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}EchoesExtend.mp3` },
    { title: 'Horizon', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Horizon1.mp3` },
    { title: 'Melanchoholic', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Melanchoholic.mp3` },
    { title: 'Aanda', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}aanda.mp3` },
    { title: 'Of the Sun', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}oftheSun.mp3` },
    { title: 'Blop', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Blop.mp3` },
    { title: 'Release', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Release.mp3` },
    { title: 'Uno1', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Uno1.mp3` },
    { title: 'Uno2', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Uno2.mp3` },
    { title: 'Fields', artist: 'BUNXAPA', file: `${import.meta.env.BASE_URL}Fields.mp3` }
  ];

  useEffect(() => {
    // Set up Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements
    const elementsToObserve = [
      videoRef.current,
      textRef.current,
      navRef.current,
      mixerRef.current,
      footerRef.current
    ].filter(Boolean);

    elementsToObserve.forEach(el => observer.observe(el));

    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.3;
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="listen-page">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="listen-video animate-video"
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

      {/* BUNXAPA Text Overlay */}
      <h1 className="listen-text animate-text" ref={textRef}>
        BUN<span className="x-letter">X</span>APA
      </h1>

      {/* Navigation Menu */}
      <nav className="nav-menu animate-nav" ref={navRef}>
        <Link to="/" className="nav-link">HOME</Link>
        <Link to="/tour" className="nav-link">DATES</Link>
        <Link to="/listen" className="nav-link active">LISTEN</Link>
        <a href="#shop" className="nav-link">SHOP</a>
      </nav>

      {/* DJ Mixer - Centered at bottom right over footer */}
      <div className="listen-mixer-container animate-mixer" ref={mixerRef}>
        <DJMixer tracks={tracks} />
      </div>

      {/* Footer */}
      <footer className="listen-footer animate-footer" ref={footerRef}>
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

export default ListenPage;
