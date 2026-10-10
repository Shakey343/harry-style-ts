// Only one thing plays at a time: an MP3's <audio> element or an embed's player.
export type Pausable = { pause: () => void };

let active: Pausable | null = null;

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

export const pauseActivePlayback = (): void => {
  const player = active;
  active = null;
  player?.pause();
};
