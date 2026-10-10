import { useCallback, useEffect, useRef } from "react";
import { useBackgroundVideo } from "../../context/BackgroundVideoContext";
import { claimPlayback, releasePlayback, type Pausable } from "./activeAudio";

// For third-party embeds: returns a callback to call when the embed starts
// playing. It mutes the background video and pauses any other player; when
// another player starts, `pause` is called to stop this embed.
export function useEmbedPlayback(pause: () => void): () => void {
  const { mute } = useBackgroundVideo();
  const pauseRef = useRef(pause);
  pauseRef.current = pause;
  // One stable handle per embed, so repeated play events never pause itself.
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
