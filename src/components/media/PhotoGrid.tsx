import { useState } from "react";
import type { Photo } from "../../types/project";
import cloudinaryUrl from "../../utils/cloudinaryUrl";
import Lightbox from "./Lightbox";

const PhotoGrid = ({ photos, title }: { photos: Photo[]; title: string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3" aria-label={`${title} photos`}>
        {photos.map((photo, i) => (
          <button
            key={photo.url}
            type="button"
            aria-label={`Open photo ${i + 1}`}
            onClick={() => setOpenIndex(i)}
            className="aspect-square cursor-pointer overflow-hidden rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-tangerine"
          >
            <img
              src={cloudinaryUrl(photo.url, "w_800,f_auto,q_auto")}
              alt={photo.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>
      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
};

export default PhotoGrid;
