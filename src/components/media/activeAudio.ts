// Anything that can be told to stop: an MP3's <audio> element or an embed's player.
export type Pausable = { pause: () => void };

let active: Pausable | null = null;

// Only one thing plays at a time: claiming playback pauses whatever held it before.
export const claimPlayback = (player: Pausable): void => {
  if (active && active !== player) {
    active.pause();
  }
  active = player;
};

export const releasePlayback = (player: Pausable): void => {
  if (active === player) {
    active = null;
  }
};

// Stops whatever is playing (e.g. when the background video is unmuted).
export const pauseActivePlayback = (): void => {
  const player = active;
  active = null;
  player?.pause();
};
