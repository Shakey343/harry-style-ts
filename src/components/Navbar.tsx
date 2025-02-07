import { useEffect, useState } from "react";
import cn from "../utils/cn";
import Button from "./Button";
import hsLogo from "../assets/hs-logo.svg";

const Navbar = ({ openModal }: { openModal: () => void }) => {
  const [showVariant, setShowVariant] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    document.addEventListener("scroll", () => {
      if (!document.scrollingElement) {
        return;
      }
      const scrolled = document.scrollingElement.scrollTop;

      if (scrolled >= 180) {
        setShowVariant(true);
      } else {
        setShowVariant(false);
      }
    });
  }, []);

  return (
    <nav>
      <div
        className={cn(
          "h-fit min-h-[88px] w-full flex items-center px-8 md:px-[80px] py-5 fixed top-0 z-30 transition-all ease-in duration-300",
          showVariant
            ? "justify-between md:bg-tangerine md:shadow"
            : "md:justify-end justify-between",
          "bg-tangerine sm:bg-transparent"
        )}
      >
        {showVariant && (
          <a href="#" className="mr-6 hidden md:block transition-all ease-in duration-300">
            <img src={hsLogo} className="h-12" alt="Handwritten logo of Harry's initials - HS" />
          </a>
        )}
        <a
          href="#"
          className="mr-6 md:hidden block"
          onClick={handleCloseMobileMenu}
        >
          <img src={hsLogo} alt="Handwritten logo of Harry's initials - HS" />
        </a>
        <div className="inset-y-0 left-0 flex items-center sm:hidden">
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-md p-2 text-teal hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={handleToggleMobileMenu}
          >
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open main menu</span>
            <svg
              className="block size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <svg
              className="hidden size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          className="gap-[60px] items-center h-full sm:flex hidden text-teal"
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
      </div>
      {showMobileMenu && (
        <div
          className="sm:hidden fixed top-[100px] bg-tangerine w-full z-50"
          id="mobile-menu"
        >
          <div className="space-y-2 px-8 pb-6 flex flex-col items-end text-teal shadow-lg">
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
              className=""
              initialWord="Get in touch"
              hoverWord="Email me"
              onClick={handleCloseMenuAndOpenModal}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
