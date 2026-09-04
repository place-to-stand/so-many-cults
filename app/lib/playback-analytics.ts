"use client";

import posthog from "posthog-js";

export type PlaybackMeta = {
  /** Track title as shown in the player. */
  title: string;
  /** Release the track belongs to (single / EP title), if any. */
  release?: string;
  /** Which player surfaced it: "single", "ep-playlist", "epk-demos". */
  player: string;
  /** Audio file path, handy for joining across renames. */
  src: string;
};

const MILESTONES = [25, 50, 75] as const;

function capture(event: string, props: Record<string, unknown>) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.capture(event, props);
}

/**
 * Per-track playback tracker. Emits:
 *  - track_play      once per load, when playback actually starts
 *  - track_progress  at 25 / 50 / 75 % (once each per load)
 *  - track_complete  when the track ends
 * Re-arms if the listener restarts the same track from the top after finishing.
 */
export function createPlaybackTracker(meta: PlaybackMeta) {
  let played = false;
  let completed = false;
  const hit = new Set<number>();
  const base = () => ({ track_title: meta.title, release_title: meta.release ?? null, player: meta.player, src: meta.src });

  return {
    onPlay() {
      if (played) return;
      played = true;
      capture("track_play", base());
    },
    onTime(current: number, duration: number) {
      if (!played || !duration) return;
      const pct = (current / duration) * 100;
      for (const m of MILESTONES) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          capture("track_progress", { ...base(), milestone: m });
        }
      }
      // Restarted from the top after completing: count it as a new play.
      if (completed && pct < 2) {
        played = false;
        completed = false;
        hit.clear();
      }
    },
    onFinish(duration: number) {
      if (completed) return;
      completed = true;
      capture("track_complete", { ...base(), duration_seconds: Math.round(duration) });
    },
  };
}

export type PlaybackTracker = ReturnType<typeof createPlaybackTracker>;
