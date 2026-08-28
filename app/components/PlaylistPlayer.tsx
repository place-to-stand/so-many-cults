"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { createPlaybackTracker, type PlaybackTracker } from "../lib/playback-analytics";

interface Track {
  title: string;
  file: string;
}

interface PlaylistPlayerProps {
  tracks: Track[];
  height?: number;
  waveColor?: string;
  progressColor?: string;
  /** "card" = boxed; "bare" = sits directly on the page. */
  variant?: "card" | "bare";
  /** Show the active track title above the waveform (the tracklist already highlights it). */
  showTitle?: boolean;
  /** Analytics context; when provided, play/progress/complete events are sent to PostHog. */
  analytics?: { release?: string; player: string };
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
  variant = "card",
  showTitle = true,
  analytics,
}: PlaylistPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isDestroyedRef = useRef(false);
  const isAdvancingTrackRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  // One playback tracker per loaded track.
  const trackerRef = useRef<PlaybackTracker | null>(null);
  useEffect(() => {
    const t = tracks[activeIndex];
    trackerRef.current = analytics && t ? createPlaybackTracker({ title: t.title, src: t.file, ...analytics }) : null;
  }, [activeIndex, tracks, analytics]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  // Track whether we should auto-play after loading
  const shouldAutoPlayRef = useRef(false);

  const loadTrack = useCallback((trackFile: string) => {
    const ws = wavesurferRef.current;
    if (!ws || isDestroyedRef.current) return;

    void ws.load(trackFile).catch((err) => {
      if (
        isDestroyedRef.current ||
        (err instanceof Error && err.name === "AbortError")
      ) {
        return;
      }

      console.error("WaveSurfer load error:", err);
      setIsLoading(false);
    });
  }, []);

  const advanceToNextTrack = useCallback(() => {
    if (isDestroyedRef.current || isAdvancingTrackRef.current) return;

    setIsPlaying(false);
    setActiveIndex((prev) => {
      const next = prev + 1;
      if (next < tracks.length) {
        isAdvancingTrackRef.current = true;
        shouldAutoPlayRef.current = true;
        return next;
      }
      return prev;
    });
  }, [tracks.length]);

  // Initialize wavesurfer once
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    isDestroyedRef.current = false;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";
    audioRef.current = audio;

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

    ws.on("ready", () => {
      if (isDestroyedRef.current) return;
      isAdvancingTrackRef.current = false;
      setIsLoading(false);
      setTotalDuration(ws.getDuration());
      ws.setVolume(volume);
      if (shouldAutoPlayRef.current) {
        shouldAutoPlayRef.current = false;
        ws.play();
      }
    });

    ws.on("play", () => {
      if (isDestroyedRef.current) return;
      setIsPlaying(true);
      trackerRef.current?.onPlay();
    });

    ws.on("pause", () => {
      if (!isDestroyedRef.current) setIsPlaying(false);
    });

    ws.on("finish", () => {
      if (!isDestroyedRef.current) trackerRef.current?.onFinish(ws.getDuration());
    });

    audio.addEventListener("ended", advanceToNextTrack);

    ws.on("timeupdate", (time) => {
      if (isDestroyedRef.current) return;
      setCurrentTime(time);
      trackerRef.current?.onTime(time, ws.getDuration());
    });

    ws.on("error", (err) => {
      if (isDestroyedRef.current) return;
      isAdvancingTrackRef.current = false;
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("WaveSurfer error:", err);
      setIsLoading(false);
    });

    // Load the first track
    loadTrack(tracks[0].file);

    return () => {
      isDestroyedRef.current = true;
      wavesurferRef.current = null;
      audioRef.current = null;
      audio.removeEventListener("ended", advanceToNextTrack);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, waveColor, progressColor, advanceToNextTrack, loadTrack, tracks]);

  // Load new track when activeIndex changes (after initial mount)
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }
    const ws = wavesurferRef.current;
    if (!ws || isDestroyedRef.current) return;

    isAdvancingTrackRef.current = false;
    setIsLoading(true);
    setCurrentTime(0);
    setTotalDuration(0);
    loadTrack(tracks[activeIndex].file);
  }, [activeIndex, loadTrack, tracks]);

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
    <div className={variant === "bare" ? "space-y-4" : "space-y-4 p-6 bg-[#1a1a1a] border border-[#333]"}>
      {/* Now playing label */}
      {showTitle && (
        <div className="font-medium text-sm truncate">
          {tracks[activeIndex].title}
        </div>
      )}

      {/* Waveform */}
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

      {/* Transport controls */}
      <div className="flex items-center gap-3 min-w-0 mb-3!">
        {/* Prev */}
        <button
          onClick={skipPrev}
          disabled={activeIndex === 0}
          className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default"
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
          className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        {/* Time */}
        <div className="flex-1 min-w-0 whitespace-nowrap text-xs text-[#888] font-mono">
          <span>{formatTime(currentTime)}</span>
          <span className="mx-1">/</span>
          <span>{formatTime(totalDuration)}</span>
        </div>

        {/* Volume */}
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

      {/* Tracklist */}
      <ul className="border-t border-[#262626] pt-3 space-y-0.5">
        {tracks.map((track, i) => (
          <li key={track.file}>
            <button
              onClick={() => selectTrack(i)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 transition-colors cursor-pointer ${
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
