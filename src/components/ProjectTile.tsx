import { forwardRef } from "react";
import { motion } from "motion/react";
import type { Project } from "../types/project";
import cloudinaryUrl from "../utils/cloudinaryUrl";

interface ProjectTileProps {
  project: Project;
  size: "full" | "small";
  index: number;
  onSelect: () => void;
}

const ProjectTile = forwardRef<HTMLButtonElement, ProjectTileProps>(
  ({ project, size, index, onSelect }, ref) => {
    const { slug, title, description, cover } = project;
    const isFull = size === "full";

    return (
      <motion.button
        ref={ref}
        layoutId={"tile-" + slug}
        type="button"
        aria-label={title}
        aria-expanded={false}
        title={isFull ? undefined : title}
        onClick={onSelect}
        className={`group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-tangerine ${
          isFull ? "w-full max-w-xs md:w-auto md:max-w-none" : "shrink-0"
        }`}
      >
        <div
          className="tile-bob"
          style={{
            animationDuration: `${4 + (index % 3) * 0.5}s`,
            animationDelay: `${-(index * 1.3) % 5}s`,
          }}
        >
          {isFull ? (
            <div className="relative h-fit border-8 border-teal shadow md:h-[300px]">
              <div className="absolute hidden h-full w-full bg-black/20 transition-all delay-200 ease-in-out group-hover:block" />
              <img
                src={cloudinaryUrl(cover.url, "w_800,f_auto,q_auto")}
                alt={cover.alt}
                className="w-full md:h-full md:w-auto"
              />
              {description && (
                <p className="absolute bottom-0 hidden w-full bg-teal p-4 pb-2 text-left text-bone text-shadow-sm transition-all delay-200 ease-in-out group-hover:block">
                  {description}
                </p>
              )}
            </div>
          ) : (
            <div className="h-20 w-16 overflow-hidden border-4 border-teal shadow">
              <img
                src={cloudinaryUrl(cover.url, "w_800,f_auto,q_auto")}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </motion.button>
    );
  }
);

ProjectTile.displayName = "ProjectTile";

export default ProjectTile;
