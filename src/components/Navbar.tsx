import { useEffect, useState } from "react";
import cn from "../utils/cn";
import Button from "./Button";
import hsLogo from "../assets/hs-logo.svg"

const Navbar = ({ openModal }: { openModal: () => void }) => {
  const [showVariant, setShowVariant] = useState(false);

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
    <div
      className={cn(
        "h-fit w-screen flex items-center h-[100px] px-[80px] py-6 fixed top-0 z-30",
        showVariant ? "justify-between bg-tangerine shadow" : "justify-end"
      )}
    >
      {showVariant && <a href="#"><img src={hsLogo} alt="Handwritten logo of Harry's initials - HS" /></a>}
      <div className={cn("flex gap-[60px] items-center h-full",
        showVariant ? "text-teal" : "text-teal"
      )}>
        <a href="#theatre">Theatre</a>
        <a href="#projects">More Projects</a>
        <a href="#about">About</a>
        <Button
          className=""
          initialWord="Get in touch"
          hoverWord="Email me"
          onClick={openModal}
        />
      </div>
    </div>
  );
};

export default Navbar;
