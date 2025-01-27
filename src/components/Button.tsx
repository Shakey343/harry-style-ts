import cn from "../utils/cn";
import { useState } from "react";

// IS THERE A WAY TO CHECK IF USER HAS EMAIL SETUP ON BROWSER?
// If so, open email app, else open modal form

const Button = ({
  className,
  initialWord,
  hoverWord,
  onClick,
}: {
  className: string;
  href?: string;
  initialWord: string;
  hoverWord: string;
  onClick: () => void;
}) => {
  const [content, setContent] = useState(initialWord);

  const handleWordChange = () => {
    setTimeout(() => {
      setContent((prevWord) =>
        prevWord === initialWord ? hoverWord : initialWord
      );
    }, 190);
  };

  return (
    <button
      className={cn(
        "cursor-pointer py-3 px-8 rounded shadow-md font-medium min-w-[155px] text-center bg-teal text-tangerine",
        "hover:bg-gradient-to-r hover:text-teal hover:bg-tangerine hover:ring ring-teal transition-all ease-in-out delay-150",
        className
      )}
      onMouseOver={handleWordChange}
      onMouseLeave={handleWordChange}
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
};

export default Button;
