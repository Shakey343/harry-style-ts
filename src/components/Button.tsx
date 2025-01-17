import cn from "../utils/cn";
import { useState } from 'react'

const Button = ({
  className,
  href,
  initialWord,
  hoverWord
}: {
  className: string;
  href?: string;
  initialWord: string;
  hoverWord: string;
}) => {
  const [content, setContent] = useState(initialWord)

  const handleWordChange = () => {
    setTimeout(() => {
      setContent(prevWord => prevWord === initialWord ? hoverWord : initialWord)
    }, 190);
  }

  return (
    <a
      className={cn(
        "cursor-pointer py-3 px-8 rounded shadow-md font-medium min-w-[155px] text-center bg-teal text-tangerine",
        "hover:bg-gradient-to-r hover:text-teal hover:bg-tangerine hover:ring ring-teal transition-all ease-in-out delay-150",
        className
      )}
      href={href}
      onMouseOver={handleWordChange}
      onMouseLeave={handleWordChange}
    >
      {content}
    </a>
  );
};

export default Button;
