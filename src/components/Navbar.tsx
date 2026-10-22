import { useEffect, useRef, useState, type RefObject } from "react";
import cn from "../utils/cn";
import Button from "./Button";
import hsLogo from "../assets/hs-logo.svg";

const Navbar = ({
  openModal,
  heroTitleRef,
}: {
  openModal: () => void;
  heroTitleRef: RefObject<HTMLElement>;
}) => {
  const [showVariant, setShowVariant] = useState(false);
  const [titleHidden, setTitleHidden] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const handleCloseMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const handleToggleMobileMenu = () => {
    setShowMobileMenu(prevState => !prevState);
  };

  const handleCloseMenuAndOpenModal = () => {
    handleCloseMobileMenu();
    openModal();
  };

  useEffect(() => {
    const handleScroll = () => setShowVariant(window.scrollY >= 180);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Phones swap the hero title for the bar's HS logo only once the title has
  // scrolled up under the bar, so the two are never on screen together.
  useEffect(() => {
    const title = heroTitleRef.current;
    if (!title) return;
    const barHeight = barRef.current?.offsetHeight ?? 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setTitleHidden(
          !entry.isIntersecting && entry.boundingClientRect.top < barHeight
        );
      },
      { rootMargin: `-${barHeight}px 0px 0px 0px` }
    );
    observer.observe(title);
    return () => observer.disconnect();
  }, [heroTitleRef]);

  useEffect(() => {
    if (!showMobileMenu) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMobileMenu(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMobileMenu]);

  return (
    <nav>
      <div
        ref={barRef}
        className={cn(
          "h-fit min-h-[88px] w-full flex items-center px-8 md:px-[80px] py-5 fixed top-0 z-30 md:transition-all ease-in duration-300 max-md:transition-none",
          showVariant ? "md:justify-between md:bg-tangerine md:shadow" : "md:justify-end",
          titleHidden ? "max-md:bg-tangerine" : ""
        )}
      >
        {showVariant && (
          <a href="#" className="mr-6 hidden md:block transition-all ease-in duration-300">
            <img src={hsLogo} className="h-12" alt="Handwritten logo of Harry's initials - HS" />
          </a>
        )}
        {titleHidden && (
          <a
            href="#"
            className="mr-6 md:hidden block"
            onClick={handleCloseMobileMenu}
          >
            <img src={hsLogo} alt="Handwritten logo of Harry's initials - HS" />
          </a>
        )}
        <button
          type="button"
          className={cn(
            "tham tham-e-squeeze tham-w-6 ml-auto md:hidden",
            showMobileMenu ? "tham-active" : ""
          )}
          aria-controls="mobile-menu"
          aria-expanded={showMobileMenu}
          aria-label={showMobileMenu ? "Close menu" : "Open menu"}
          onClick={handleToggleMobileMenu}
        >
          <div className="tham-box">
            <div className="tham-inner bg-teal" />
          </div>
        </button>
        <div
          className="gap-[60px] items-center h-full md:flex hidden text-teal"
        >
          <a href="#theatre" className="hover:underline underline-offset-4 transition-all duration-300 ease">Theatre</a>
          <a href="#projects" className="hover:underline underline-offset-4 transition-all duration-300 ease">More Projects</a>
          <a href="#about" className="hover:underline underline-offset-4 transition-all duration-300 ease">About</a>
          <Button
            className=""
            initialWord="Get in touch"
            hoverWord="Email me"
            onClick={openModal}
          />
        </div>
        {/* Behind the bar's logo and toggle, so the toggle becomes the ✕. */}
        {showMobileMenu && (
          <div
            className="md:hidden fixed inset-0 -z-10 bg-tangerine px-8 pt-36 flex flex-col items-start gap-6 text-3xl text-teal"
            id="mobile-menu"
          >
            <a href="#theatre" onClick={handleCloseMobileMenu}>
              Theatre
            </a>
            <a href="#projects" onClick={handleCloseMobileMenu}>
              More Projects
            </a>
            <a href="#about-mobile" onClick={handleCloseMobileMenu}>
              About
            </a>
            <Button
              className="mt-10"
              initialWord="Get in touch"
              hoverWord="Email me"
              onClick={handleCloseMenuAndOpenModal}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
