import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import Lightbox from "./Lightbox";

const photos = [
  { url: "https://res.cloudinary.com/x/image/upload/v1/a.jpg", alt: "A" },
  { url: "https://res.cloudinary.com/x/image/upload/v1/b.jpg", alt: "B" },
  { url: "https://res.cloudinary.com/x/image/upload/v1/c.jpg", alt: "C" },
];

const Harness = ({ start = 0, onClose = () => {} }) => {
  const [i, setI] = useState(start);
  return (
    <Lightbox
      photos={photos}
      index={i}
      onIndexChange={setI}
      onClose={onClose}
    />
  );
};

describe("Lightbox", () => {
  it("shows counter and wraps forward from last to first", async () => {
    render(<Harness start={2} />);
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByAltText("A")).toHaveAttribute(
      "src",
      expect.stringContaining("f_auto,q_auto")
    );
  });

  it("arrow keys navigate", async () => {
    render(<Harness />);
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("escape closes and does not propagate", async () => {
    const onClose = vi.fn();
    const parentKey = vi.fn();
    render(
      <div onKeyDown={parentKey}>
        <Harness onClose={onClose} />
      </div>
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(parentKey).not.toHaveBeenCalled();
  });

  it("backdrop click closes, image click does not", async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await userEvent.click(screen.getByAltText("A"));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("restores focus on close", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();
    const { unmount } = render(<Harness />);
    expect(
      screen.getByRole("button", { name: "Close photo viewer" })
    ).toHaveFocus();
    unmount();
    expect(opener).toHaveFocus();
    opener.remove();
  });
});
