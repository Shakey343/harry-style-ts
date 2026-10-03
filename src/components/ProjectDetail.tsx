import { useId } from "react";
import type { Project } from "../types/project";
import cloudinaryUrl from "../utils/cloudinaryUrl";
import AudioPlayer from "./media/AudioPlayer";
import InstagramEmbed from "./media/InstagramEmbed";
import PhotoGrid from "./media/PhotoGrid";
import SoundCloudEmbed from "./media/SoundCloudEmbed";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
}

const ProjectDetail = ({ project, onClose, closeButtonRef }: ProjectDetailProps) => {
  const titleId = useId();
  const { cover, title, description, blurb, link, photos, audio, soundcloud, instagram } = project;

  const coverImage = (
    <img src={cloudinaryUrl(cover.url, 'f_auto,q_auto')} alt={cover.alt} className="h-full w-full object-cover" />
  );

  return (
    <section aria-labelledby={titleId} className="relative h-full overflow-y-auto bg-bone text-night">
      <div className="sticky top-4 z-10 flex h-0 justify-end pr-4">
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close project"
          onClick={onClose}
          className="h-fit cursor-pointer rounded bg-night/70 px-3 py-2 text-bone hover:text-tangerine focus:outline-none focus-visible:ring-2 focus-visible:ring-tangerine"
        >
          ✕
        </button>
      </div>
      <header className="relative h-64 w-full md:h-96">
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
          <h3 id={titleId} className="font-serif text-3xl text-bone md:text-5xl">
            {title}
            {link && <span aria-hidden="true"> ↗</span>}
          </h3>
          {description && <p className="mt-2 text-bone2">{description}</p>}
        </div>
      </header>
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-8">
        {blurb && <p className="whitespace-pre-line font-serif text-lg">{blurb}</p>}
        {photos.length > 0 && <PhotoGrid photos={photos} title={title} />}
        {audio.length > 0 && (
          <div className="flex flex-col gap-3">
            {audio.map((track) => (
              <AudioPlayer key={track.url} track={track} />
            ))}
          </div>
        )}
        {soundcloud && <SoundCloudEmbed url={soundcloud} />}
        {instagram && <InstagramEmbed url={instagram} />}
      </div>
    </section>
  );
};

export default ProjectDetail;
