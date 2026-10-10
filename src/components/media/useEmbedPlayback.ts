import { useCallback, useEffect, useRef } from "react";
import { useBackgroundVideo } from "../../context/BackgroundVideoContext";
import { claimPlayback, releasePlayback, type Pausable } from "./activeAudio";

// Returns the callback an embed calls when it starts playing: it mutes the
// background video and pauses any other player. `pause` stops this embed when
// something else starts.
export default function useEmbedPlayback(pause: () => void): () => void {
  const { mute } = useBackgroundVideo();
  const pauseRef = useRef(pause);
  pauseRef.current = pause;
  // Stable, so repeated play events from this embed never pause itself.
  const handleRef = useRef<Pausable>({ pause: () => pauseRef.current() });

  useEffect(() => {
    const handle = handleRef.current;
    return () => releasePlayback(handle);
  }, []);

  return useCallback(() => {
    claimPlayback(handleRef.current);
    mute();
  }, [mute]);
}
