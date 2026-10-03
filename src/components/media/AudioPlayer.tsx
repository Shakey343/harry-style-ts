import { useEffect, useRef, useState } from "react";
import { useBackgroundVideo } from "../../context/BackgroundVideoContext";
import type { Track } from "../../types/project";
import { claimPlayback } from "./activeAudio";

const AudioPlayer = ({ track }: { track: Track }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { mute } = useBackgroundVideo();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) {
      return;
    }
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onTimeUpdate = () => {
      setProgress(
        el.duration > 0
          ? Math.min(100, Math.max(0, (el.currentTime / el.duration) * 100))
          : 0
      );
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const handleToggle = () => {
    const el = audioRef.current;
    if (!el) {
      return;
    }
    if (playing) {
      el.pause();
      return;
    }
    claimPlayback(el);
    mute();
    void el.play();
  };

  return (
    <div className="flex items-center gap-3 rounded bg-teal px-4 py-3 shadow-md">
      <audio ref={audioRef} src={track.url} preload="none" />
      <button
        type="button"
        aria-label={`${playing ? "Pause" : "Play"} ${track.name}`}
        onClick={handleToggle}
        className="cursor-pointer text-tangerine font-medium min-w-[3.5rem] text-left"
      >
        {playing ? "Pause" : "Play"}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-bone">{track.name}</span>
        <div
          role="progressbar"
          aria-label={`${track.name} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className="h-1 w-full overflow-hidden rounded bg-bone/20"
        >
          <div
            className="h-full bg-tangerine"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
