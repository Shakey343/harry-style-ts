import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { pauseActivePlayback } from "../components/media/activeAudio";

interface BackgroundVideoValue {
  videoRef: RefObject<HTMLVideoElement>;
  muted: boolean;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;
}

const BackgroundVideoContext = createContext<BackgroundVideoValue | null>(null);

export const BackgroundVideoProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const mute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
    setMuted(true);
  }, []);

  const unmute = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    pauseActivePlayback();
    video.muted = false;
    video.play();
    setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current?.muted) {
      unmute();
    } else {
      mute();
    }
  }, [mute, unmute]);

  const value = useMemo(
    () => ({ videoRef, muted, mute, unmute, toggleMute }),
    [muted, mute, unmute, toggleMute]
  );

  return (
    <BackgroundVideoContext.Provider value={value}>
      {children}
    </BackgroundVideoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBackgroundVideo = () => {
  const ctx = useContext(BackgroundVideoContext);
  if (!ctx) {
    throw new Error(
      "useBackgroundVideo must be used within BackgroundVideoProvider"
    );
  }
  return ctx;
};
