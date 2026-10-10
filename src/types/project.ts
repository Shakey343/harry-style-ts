export type Section = "theatre" | "more-projects";

export type Photo = { url: string; alt: string };

export type Track = { url: string; name: string };

export type Project = {
  slug: string;
  title: string;
  description?: string;
  blurb?: string;
  link?: string;
  soundcloud?: string;
  instagram?: string;
  spotify?: string;
  youtube?: string;
  cover: Photo;
  photos: Photo[];
  audio: Track[];
};
