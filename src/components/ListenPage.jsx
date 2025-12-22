import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListenPage.css';
import DJMixer from './DJMixer';

const ListenPage = () => {
  const videoRef = useRef(null);

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
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.3;
    }
  }, []);

  return (
    <div className="listen-page">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="listen-video"
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
      <h1 className="listen-text">
        BUN<span className="x-letter">X</span>APA
      </h1>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        <Link to="/" className="nav-link">HOME</Link>
        <a href="#dates" className="nav-link">DATES</a>
        <Link to="/listen" className="nav-link active">LISTEN</Link>
        <a href="#shop" className="nav-link">SHOP</a>
      </nav>

      {/* DJ Mixer - Centered at bottom right over footer */}
      <div className="listen-mixer-container">
        <DJMixer tracks={tracks} />
      </div>

      {/* Footer */}
      <footer className="listen-footer">
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
