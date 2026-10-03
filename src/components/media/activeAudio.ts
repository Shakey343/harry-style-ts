let active: HTMLAudioElement | null = null;

export const claimPlayback = (el: HTMLAudioElement): void => {
  if (active && active !== el) {
    active.pause();
  }
  active = el;
};
