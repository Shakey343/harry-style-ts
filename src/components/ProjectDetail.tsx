import { useEffect, useId, useRef, useState } from "react";
import type { Project } from "../types/project";
import cloudinaryUrl from "../utils/cloudinaryUrl";
import cn from "../utils/cn";
import AudioPlayer from "./media/AudioPlayer";
import InstagramEmbed from "./media/InstagramEmbed";
import PhotoGrid from "./media/PhotoGrid";
import SoundCloudEmbed from "./media/SoundCloudEmbed";
import SpotifyEmbed from "./media/SpotifyEmbed";
import YouTubeEmbed from "./media/YouTubeEmbed";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
}

const ProjectDetail = ({
  project,
  onClose,
  closeButtonRef,
}: ProjectDetailProps) => {
  const titleId = useId();
  const {
    cover,
    title,
    description,
    blurb,
    link,
    photos,
    audio,
    soundcloud,
    spotify,
    youtube,
    instagram,
  } = project;

  const coverRef = useRef<HTMLImageElement>(null);
  const [coverLoaded, setCoverLoaded] = useState(false);

  // A cached image can finish loading before React attaches onLoad.
  useEffect(() => {
    if (coverRef.current?.complete && coverRef.current.naturalWidth > 0)
      setCoverLoaded(true);
  }, []);

  const coverImage = (
    <img
      ref={coverRef}
      src={cloudinaryUrl(cover.url, "f_auto,q_auto")}
      alt={cover.alt}
      onLoad={() => setCoverLoaded(true)}
      className={cn(
        "h-full w-full object-cover transition-opacity duration-500",
        coverLoaded ? "opacity-100" : "opacity-0"
      )}
    />
  );

  return (
    <section
      aria-labelledby={titleId}
      className="relative overflow-x-clip bg-teal text-bone"
    >
      {/* Sticks just below the fixed navbar (112px on phones, 88px on desktop) */}
      <div className="sticky top-32 z-10 flex h-0 justify-end pr-4 md:top-28 animate-fade-in-after-grow motion-reduce:animate-none">
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close project"
          onClick={onClose}
          className="h-fit cursor-pointer rounded bg-night/70 px-3 py-2 my-4 text-bone hover:text-tangerine focus:outline-none focus-visible:ring-2 focus-visible:ring-tangerine"
        >
          ✕
        </button>
      </div>
      <div className="animate-fade-in-after-grow motion-reduce:animate-none">
        <header className="relative h-64 w-full bg-night md:h-96">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full"
            >
              {coverImage}
            </a>
          ) : (
            coverImage
          )}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-night/90 via-night/30 to-transparent p-6">
            <h3
              id={titleId}
              className="font-serif text-3xl text-bone md:text-5xl"
            >
              {title}
              {link && <span aria-hidden="true"> ↗</span>}
            </h3>
            {description && <p className="mt-2 text-bone2">{description}</p>}
          </div>
        </header>
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-8">
          {blurb && (
            <p className="whitespace-pre-line font-serif text-lg">{blurb}</p>
          )}
          {photos.length > 0 && <PhotoGrid photos={photos} title={title} />}
          {audio.length > 0 && (
            <div className="flex flex-col gap-3">
              {audio.map(track => (
                <AudioPlayer key={track.url} track={track} />
              ))}
            </div>
          )}
          {soundcloud && <SoundCloudEmbed url={soundcloud} />}
          {spotify && <SpotifyEmbed url={spotify} />}
          {youtube && <YouTubeEmbed url={youtube} />}
          {instagram && <InstagramEmbed url={instagram} />}
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;
