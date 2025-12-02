import React from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { cn } from "../lib/utils";
import "./LiquidGlassPlayer.css";

// Constants
const VOLUME_BAR_COUNT = 8;
const SEEK_JUMP_SECONDS = 5;
const TIMER_INTERVAL_MS = 1000;
const MIN_TIME = 0;
const BAR_DELAY_INCREMENT = 0.1;
const PROGRESS_PERCENTAGE_MULTIPLIER = 100;

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Glass Filter Component
const GlassFilter = React.memo(({ id, scale = 30 }) => (
  <svg className="glass-filter-svg">
    <title>Glass Effect Filter</title>
    <defs>
      <filter
        colorInterpolationFilters="sRGB"
        height="200%"
        id={id}
        width="200%"
        x="-50%"
        y="-50%"
      >
        <feTurbulence
          baseFrequency="0.05 0.05"
          numOctaves="1"
          result="turbulence"
          seed="1"
          type="fractalNoise"
        />
        <feGaussianBlur
          in="turbulence"
          result="blurredNoise"
          stdDeviation="2"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="blurredNoise"
          result="displaced"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="B"
        />
        <feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
        <feComposite in="finalBlur" in2="finalBlur" operator="over" />
      </filter>
    </defs>
  </svg>
));
GlassFilter.displayName = "GlassFilter";

// Volume Bars Component
const VolumeBars = React.memo(({ isPlaying }) => {
  const bars = Array.from({ length: VOLUME_BAR_COUNT }, (_, i) => ({
    id: `bar-${i}`,
    delay: i * BAR_DELAY_INCREMENT,
  }));

  return (
    <div className="volume-bars">
      {bars.map((bar) => (
        <div
          className={cn("volume-bar", isPlaying && "volume-bar-animated")}
          key={bar.id}
          style={{
            animationDelay: `${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
});
VolumeBars.displayName = "VolumeBars";

// Progress Bar Component
const ProgressBar = React.memo(({ currentTime, totalDuration, onSeek }) => {
  const progress = (currentTime / totalDuration) * PROGRESS_PERCENTAGE_MULTIPLIER;

  const handleClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = Math.min(
      Math.max(MIN_TIME, percent * totalDuration),
      totalDuration
    );
    onSeek(newTime);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const newTime = Math.min(
        currentTime + SEEK_JUMP_SECONDS,
        totalDuration
      );
      onSeek(newTime);
    }
  };

  return (
    <>
      <div className="progress-time-labels">
        <span className="progress-time">{formatTime(currentTime)}</span>
        <span className="progress-time">{formatTime(totalDuration)}</span>
      </div>
      <div
        aria-label="Seek progress bar"
        aria-valuemax={totalDuration}
        aria-valuemin={MIN_TIME}
        aria-valuenow={currentTime}
        className="progress-bar-container"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="slider"
        tabIndex={0}
      >
        <div
          className="progress-bar-filled"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
});
ProgressBar.displayName = "ProgressBar";

// Liquid Button Component
export function LiquidButton({
  className,
  liquidVariant = "default",
  children,
  ...props
}) {
  const filterId = React.useId();

  return (
    <>
      <button
        className={cn(
          "liquid-button",
          liquidVariant === "default" && "liquid-button-hover",
          className
        )}
        {...props}
      >
        <div className="liquid-button-shadow" />
        <div
          className="liquid-button-filter"
          style={{ backdropFilter: `url("#${filterId}")` }}
        />
        <span className="liquid-button-content">{children}</span>
      </button>
      <GlassFilter id={filterId} scale={70} />
    </>
  );
}

// Liquid Glass Card Component
export function LiquidGlassCard({
  className,
  glassSize = "default",
  glassEffect = true,
  children,
  ...props
}) {
  const filterId = React.useId();

  return (
    <div
      className={cn(
        "liquid-glass-card",
        `liquid-glass-card-${glassSize}`,
        className
      )}
      {...props}
    >
      <div className="liquid-glass-card-shadow" />

      {glassEffect && (
        <>
          <div
            className="liquid-glass-card-filter"
            style={{ backdropFilter: `url("#${filterId}")` }}
          />
          <GlassFilter id={filterId} scale={30} />
        </>
      )}

      <div className="liquid-glass-card-content">{children}</div>

      <div className="liquid-glass-card-gradient" />
    </div>
  );
}

// Main Music Player Component
export function LiquidGlassPlayer({ 
  currentTrack, 
  isPlaying, 
  currentTime, 
  duration,
  onPlayPause,
  onNext,
  onPrev,
  onSeek
}) {
  return (
    <div className="liquid-player-wrapper">
      <LiquidGlassCard className="liquid-player-card">
        <div className="liquid-player-header">
          <div className="liquid-player-info">
            <h3 className="liquid-player-title">{currentTrack.title}</h3>
            <p className="liquid-player-artist">{currentTrack.artist}</p>
          </div>

          <VolumeBars isPlaying={isPlaying} />
        </div>

        <div className="liquid-player-controls">
          <ProgressBar
            currentTime={currentTime}
            onSeek={onSeek}
            totalDuration={duration || 0}
          />

          <div className="liquid-player-buttons">
            <div className="liquid-player-nav-buttons">
              <LiquidButton
                aria-label="Previous track"
                className="liquid-nav-button"
                onClick={onPrev}
              >
                <ArrowLeft className="liquid-icon" />
              </LiquidButton>
              <LiquidButton
                aria-label={isPlaying ? "Pause" : "Play"}
                className="liquid-play-button"
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <Pause className="liquid-play-icon" />
                ) : (
                  <Play className="liquid-play-icon" />
                )}
              </LiquidButton>
              <LiquidButton
                aria-label="Next track"
                className="liquid-nav-button"
                onClick={onNext}
              >
                <ArrowRight className="liquid-icon" />
              </LiquidButton>
            </div>
            <LiquidButton
              aria-label="More options"
              className="liquid-nav-button"
            >
              <svg
                className="liquid-icon"
                fill="currentColor"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Options</title>
                <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847" />
              </svg>
            </LiquidButton>
          </div>
        </div>
      </LiquidGlassCard>
    </div>
  );
}

