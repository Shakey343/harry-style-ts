import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProjects } from "./useProjects";

vi.mock("axios");
const mockedGet = vi.mocked(axios.get);

describe("useProjects", () => {
  beforeEach(() => { mockedGet.mockReset(); });

  it("starts loading then ready with projects", async () => {
    const projects = [{ id: "a" }];
    mockedGet.mockResolvedValue({ data: { projects } });
    const { result } = renderHook(() => useProjects("theatre"));
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.projects).toEqual(projects);
  });

  it("error status when request fails", async () => {
    mockedGet.mockImplementation(() => Promise.reject(new Error("boom")));
    const { result } = renderHook(() => useProjects("theatre"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.projects).toEqual([]);
  });

  it("requests the section url", async () => {
    mockedGet.mockResolvedValue({ data: { projects: [] } });
    renderHook(() => useProjects("more-projects"));
    await waitFor(() => expect(mockedGet).toHaveBeenCalled());
    expect(mockedGet).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BACKEND_URL}api/projects?section=more-projects`
    );
  });

  it("error status when 200 response is not the expected JSON", async () => {
    mockedGet.mockResolvedValue({ data: "<!doctype html><html></html>" });
    const { result } = renderHook(() => useProjects("theatre"));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.projects).toEqual([]);
  });
});
