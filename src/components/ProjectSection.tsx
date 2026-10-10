import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import type { Project, Section } from "../types/project";
import { useProjects } from "../hooks/useProjects";
import { useMediaQuery } from "../hooks/useMediaQuery";
import splitAround from "../utils/splitAround";
import ProjectTile from "./ProjectTile";
import ProjectDetail from "./ProjectDetail";
import { LAYOUT_TRANSITION } from "../utils/motion";

const PLACEHOLDER_COUNT = 3;

const ProjectSection = ({ tag }: { tag: Section }) => {
  const { projects, status } = useProjects(tag);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastSlugRef = useRef<string | null>(null);

  const selectedIndex = projects.findIndex(p => p.slug === selectedSlug);
  const selected = selectedIndex === -1 ? null : projects[selectedIndex];

  useEffect(() => {
    if (selectedSlug) {
      closeButtonRef.current?.focus({ preventScroll: true });
    } else if (lastSlugRef.current) {
      tileRefs.current[lastSlugRef.current]?.focus({ preventScroll: true });
      lastSlugRef.current = null;
    }
  }, [selectedSlug]);

  const select = (slug: string) => {
    setSelectedSlug(slug);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reset = () => {
    lastSlugRef.current = selectedSlug;
    setSelectedSlug(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && selected) {
      e.stopPropagation();
      reset();
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-wrap justify-center gap-10" aria-busy="true">
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
          <div
            key={i}
            data-testid="tile-placeholder"
            className="h-[300px] w-56 animate-pulse border-8 border-teal bg-teal/30"
          />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-bone">Projects unavailable right now</p>
    );
  }

  const renderTile = (project: Project, size: "full" | "small") => (
    <ProjectTile
      key={project.slug}
      ref={el => {
        tileRefs.current[project.slug] = el;
      }}
      project={project}
      size={size}
      index={projects.indexOf(project)}
      onSelect={() => select(project.slug)}
    />
  );

  const renderContent = () => {
    if (!selected) {
      return (
        <div className="flex flex-wrap justify-center gap-10">
          {projects.map(p => renderTile(p, "full"))}
        </div>
      );
    }

    const { left, right } = splitAround(projects, selectedIndex);
    const stripClass = "flex shrink-0 gap-4 p-2";
    const detail = (
      <motion.div
        key={selected.slug}
        layoutId={"tile-" + selected.slug}
        transition={LAYOUT_TRANSITION}
        className="min-w-0 flex-1"
      >
        <ProjectDetail
          project={selected}
          onClose={reset}
          closeButtonRef={closeButtonRef}
        />
      </motion.div>
    );

    if (!isDesktop) {
      return (
        <div className="flex flex-col gap-4">
          <div
            data-testid="strip-mobile"
            className={`${stripClass} overflow-x-auto`}
          >
            {[...left, ...right].map(p => renderTile(p, "small"))}
          </div>
          {detail}
        </div>
      );
    }

    return (
      <div className="flex items-start gap-4">
        <div data-testid="strip-left" className={`${stripClass} flex-col`}>
          {left.map(p => renderTile(p, "small"))}
        </div>
        {detail}
        <div data-testid="strip-right" className={`${stripClass} flex-col`}>
          {right.map(p => renderTile(p, "small"))}
        </div>
      </div>
    );
  };

  return (
    <LayoutGroup id={tag}>
      <div
        ref={sectionRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="scroll-mt-32 focus:outline-none md:scroll-mt-28"
      >
        {renderContent()}
      </div>
    </LayoutGroup>
  );
};

export default ProjectSection;
