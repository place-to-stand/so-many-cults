"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";

interface Track {
  title: string;
  file: string;
}

interface PlaylistPlayerProps {
  tracks: Track[];
  height?: number;
  waveColor?: string;
  progressColor?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PlaylistPlayer({
  tracks,
  height = 64,
  waveColor = "rgba(102, 102, 102, 0.6)",
  progressColor = "rgba(255, 255, 255, 0.9)",
}: PlaylistPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isDestroyedRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  // Track whether we should auto-play after loading
  const shouldAutoPlayRef = useRef(false);

  // Initialize wavesurfer once
  useEffect(() => {
    if (!containerRef.current) return;

    isDestroyedRef.current = false;

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audioRef.current = audio;

    const ws = WaveSurfer.create({
      container: containerRef.current,
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

    ws.on("ready", () => {
      if (isDestroyedRef.current) return;
      setIsLoading(false);
      setTotalDuration(ws.getDuration());
      ws.setVolume(volume);
      if (shouldAutoPlayRef.current) {
        shouldAutoPlayRef.current = false;
        ws.play();
      }
    });

    ws.on("play", () => {
      if (!isDestroyedRef.current) setIsPlaying(true);
    });

    ws.on("pause", () => {
      if (!isDestroyedRef.current) setIsPlaying(false);
    });

    ws.on("finish", () => {
      if (isDestroyedRef.current) return;
      setIsPlaying(false);
      // Auto-advance to next track
      setActiveIndex((prev) => {
        const next = prev + 1;
        if (next < tracks.length) {
          shouldAutoPlayRef.current = true;
          return next;
        }
        return prev;
      });
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

    // Load the first track
    ws.load(tracks[0].file);

    return () => {
      isDestroyedRef.current = true;
      wavesurferRef.current = null;
      audioRef.current = null;

      audio.pause();
      audio.src = "";
      audio.load();

      try {
        ws.unAll();
      } catch {
        // Ignore
      }

      while (containerRef.current?.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, waveColor, progressColor]);

  // Load new track when activeIndex changes (after initial mount)
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }
    const ws = wavesurferRef.current;
    if (!ws || isDestroyedRef.current) return;

    setIsLoading(true);
    setCurrentTime(0);
    setTotalDuration(0);
    ws.load(tracks[activeIndex].file);
  }, [activeIndex, tracks]);

  const togglePlayPause = useCallback(() => {
    if (wavesurferRef.current && !isDestroyedRef.current) {
      wavesurferRef.current.playPause();
    }
  }, []);

  const selectTrack = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        togglePlayPause();
      } else {
        shouldAutoPlayRef.current = true;
        setActiveIndex(index);
      }
    },
    [activeIndex, togglePlayPause]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (wavesurferRef.current && !isDestroyedRef.current) {
        wavesurferRef.current.setVolume(newVolume);
      }
    },
    []
  );

  const skipPrev = useCallback(() => {
    if (activeIndex > 0) {
      shouldAutoPlayRef.current = isPlaying;
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex, isPlaying]);

  const skipNext = useCallback(() => {
    if (activeIndex < tracks.length - 1) {
      shouldAutoPlayRef.current = isPlaying;
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, tracks.length, isPlaying]);

  return (
    <div className="space-y-3 p-4 rounded-lg bg-[#1a1a1a] border border-[#333]">
      {/* Now playing label */}
      <div className="font-medium text-sm truncate">
        {tracks[activeIndex].title}
      </div>

      {/* Waveform */}
      <div className="relative">
        <div
          ref={containerRef}
          className={`w-full rounded overflow-hidden ${isLoading ? "opacity-50" : ""}`}
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

      {/* Transport controls */}
      <div className="flex items-center gap-3">
        {/* Prev */}
        <button
          onClick={skipPrev}
          disabled={activeIndex === 0}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-30"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={skipNext}
          disabled={activeIndex === tracks.length - 1}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-30"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        {/* Time */}
        <div className="flex-1 text-xs text-[#888] font-mono">
          <span>{formatTime(currentTime)}</span>
          <span className="mx-1">/</span>
          <span>{formatTime(totalDuration)}</span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-[#888]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"
            />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 rounded-full appearance-none bg-[#333] cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      </div>

      {/* Tracklist */}
      <ul className="border-t border-[#333] pt-3 space-y-0.5">
        {tracks.map((track, i) => (
          <li key={track.file}>
            <button
              onClick={() => selectTrack(i)}
              className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-3 transition-colors ${
                i === activeIndex
                  ? "bg-white/10 text-white"
                  : "text-[#888] hover:text-[#ccc] hover:bg-white/5"
              }`}
            >
              <span className="w-5 text-center text-xs tabular-nums">
                {i === activeIndex && isPlaying ? (
                  <svg
                    className="h-3 w-3 inline"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="truncate">{track.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
