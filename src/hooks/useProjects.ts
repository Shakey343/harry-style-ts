import { useEffect, useState } from "react";
import axios from "axios";
import type { Project, Section } from "../types/project";

type Status = "loading" | "ready" | "error";

export default function useProjects(section: Section) {
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
        // A misconfigured backend URL can return index.html with a 200.
        const data = res.data?.projects;
        setProjects(Array.isArray(data) ? data : []);
        setStatus(Array.isArray(data) ? "ready" : "error");
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
