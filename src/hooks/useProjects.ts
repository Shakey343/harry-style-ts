import { useEffect, useState } from "react";
import axios from "axios";
import type { Project, Section } from "../types/project";

type Status = "loading" | "ready" | "error";

export function useProjects(section: Section): {
  projects: Project[];
  status: Status;
} {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    axios
      .get<{ projects: Project[] }>(
        `${import.meta.env.VITE_BACKEND_URL}api/projects?section=${section}`
      )
      .then(res => {
        if (cancelled) return;
        const data = res.data?.projects;
        if (Array.isArray(data)) {
          setProjects(data);
          setStatus("ready");
        } else {
          setProjects([]);
          setStatus("error");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setProjects([]);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [section]);

  return { projects, status };
}
