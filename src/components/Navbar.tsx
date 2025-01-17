import { useEffect, useState } from "react";
import cn from "../utils/cn";
import Button from "./Button";

const Navbar = () => {
  const [showVariant, setShowVariant] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (!document.scrollingElement) {
        return;
      }
      const scrolled = document.scrollingElement.scrollTop;

      // console.log(e);
      if (scrolled >= 450) {
        setShowVariant(true);
      } else {
        setShowVariant(false);
      }
    });
  }, []);

  return (
    <div
      className={cn(
        "h-fit w-screen flex px-[80px] h-[100px] fixed top-0",
        showVariant ? "justify-between" : "justify-end"
      )}
    >
      <div className="flex gap-[60px] items-center h-full text-teal">
        <span>About</span>
        <span>Theatre</span>
        <span>More Projects</span>
        <Button className="" href="" initialWord="Get in touch" hoverWord="Email me"/>
      </div>
    </div>
  );
};

export default Navbar;
