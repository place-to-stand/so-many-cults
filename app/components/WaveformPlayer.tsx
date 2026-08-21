"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformPlayerProps {
  audioUrl: string;
  title: string;
  /** Hide the in-player title (e.g. when the surrounding card already shows it). */
  showTitle?: boolean;
  /** "card" = boxed player; "bare" = waveform sits directly on the page between hairlines. */
  variant?: "card" | "bare";
  height?: number;
  waveColor?: string;
  progressColor?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function WaveformPlayer({
  audioUrl,
  title,
  showTitle = true,
  variant = "card",
  height = 64,
  waveColor = "rgba(102, 102, 102, 0.6)",
  progressColor = "rgba(255, 255, 255, 0.9)",
}: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isDestroyedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  // Initialize wavesurfer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    isDestroyedRef.current = false;

    // Clear any existing content
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Create audio element for MediaElement backend
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";

    const ws = WaveSurfer.create({
      container,
      height,
      waveColor,
      progressColor,
      cursorWidth: 2,
      cursorColor: "rgba(255, 255, 255, 0.8)",
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      media: audio,
    });

    wavesurferRef.current = ws;

    // Load audio
    ws.load(audioUrl);

    // Event listeners
    ws.on("ready", () => {
      if (isDestroyedRef.current) return;
      setIsLoading(false);
      const dur = ws.getDuration();
      setTotalDuration(dur);
      ws.setVolume(0.8);
    });

    ws.on("play", () => {
      if (!isDestroyedRef.current) setIsPlaying(true);
    });

    ws.on("pause", () => {
      if (!isDestroyedRef.current) setIsPlaying(false);
    });

    ws.on("finish", () => {
      if (!isDestroyedRef.current) setIsPlaying(false);
    });

    ws.on("timeupdate", (time) => {
      if (!isDestroyedRef.current) setCurrentTime(time);
    });

    ws.on("error", (err) => {
      if (isDestroyedRef.current) return;
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("WaveSurfer error:", err);
      setIsLoading(false);
    });

    return () => {
      isDestroyedRef.current = true;
      wavesurferRef.current = null;

      audio.pause();
      audio.src = "";
      audio.load();

      try {
        ws.unAll();
      } catch {
        // Ignore
      }

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [audioUrl, height, waveColor, progressColor]);

  const togglePlayPause = useCallback(() => {
    if (wavesurferRef.current && !isDestroyedRef.current) {
      wavesurferRef.current.playPause();
    }
  }, []);

  // Mute toggle: remembers the pre-mute level; dragging the slider un-mutes.
  const [isMuted, setIsMuted] = useState(false);
  const preMuteVolumeRef = useRef(0.8);
  const toggleMute = useCallback(() => {
    const ws = wavesurferRef.current;
    if (isMuted) {
      const restored = preMuteVolumeRef.current || 0.8;
      setVolume(restored);
      setIsMuted(false);
      ws?.setVolume(restored);
    } else {
      preMuteVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
      ws?.setVolume(0);
    }
  }, [isMuted, volume]);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
      if (wavesurferRef.current && !isDestroyedRef.current) {
        wavesurferRef.current.setVolume(newVolume);
      }
    },
    []
  );

  return (
    <div
      className={
        variant === "bare"
          ? "space-y-4"
          : `space-y-4 p-6 ${showTitle ? "" : "pt-8"} bg-[#1a1a1a] border border-[#333]`
      }
    >
      {/* Title */}
      {showTitle && <div className="font-medium text-sm truncate">{title}</div>}

      {/* Waveform container */}
      <div className="relative">
        <div
          ref={containerRef}
          className={`w-full overflow-hidden cursor-pointer ${isLoading ? "opacity-50" : ""}`}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-[#666]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default"
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Time display */}
        <div className="flex-1 text-xs text-[#888] font-mono">
          <span>{formatTime(currentTime)}</span>
          <span className="mx-1">/</span>
          <span>{formatTime(totalDuration)}</span>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 self-center">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            aria-pressed={isMuted}
            title={isMuted ? "Unmute" : "Mute"}
            className="h-6 w-6 -m-1 flex items-center justify-center text-[#888] hover:text-white transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMuted ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H2v6h4l5 4V5zM16 9l5 6M21 9l-5 6" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
              )}
            </svg>
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
            className="block w-16 h-3 mr-1 appearance-none bg-transparent cursor-pointer
              [&::-webkit-slider-runnable-track]:h-1
              [&::-webkit-slider-runnable-track]:rounded-full
              [&::-webkit-slider-runnable-track]:bg-[#333]
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:-mt-1
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-moz-range-track]:h-1
              [&::-moz-range-track]:rounded-full
              [&::-moz-range-track]:bg-[#333]
              [&::-moz-range-thumb]:w-3
              [&::-moz-range-thumb]:h-3
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
