import cn from "../utils/cn";

// Get icon showing on hover according to the link
// After the first "." if === "soundcloud" etc.

const Card = ({
  imgUrl,
  link,
  className,
}: {
  imgUrl: string;
  link: string;
  className: string;
}) => {
  return (
    <a href={link} className="group shadow cursor-pointer">
      <div className={cn("h-fit md:h-[300px] border-8 border-teal relative", className)}>
        <div className="absolute hidden group-hover:block h-full w-full bg-black/20 transition-all"></div>
        <img src={imgUrl} alt="" className="h-full" />
      </div>
    </a>
  );
};

export default Card;
