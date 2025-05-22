import cn from "../utils/cn";

// TODO: Get icon showing on hover according to the link
// After the first "." if === "soundcloud" etc.

const Card = ({
  imgId,
  imgUrl,
  link,
  className,
  subtitle,
}: {
  imgId: string;
  imgUrl: string;
  link: string;
  className: string;
  subtitle: string;
}) => {
  return (
    <a href={link} className="group shadow cursor-pointer" target="_blank">
      <div className={cn("h-fit md:h-[300px] border-8 border-teal relative", className)}>
        <div className="absolute hidden group-hover:block h-full w-full bg-black/20 transition-all ease-in-out delay-200"></div>
        <img src={imgUrl} alt={imgId} className="md:h-full" />
        <p className="hidden group-hover:block transition-all ease-in-out delay-200 absolute p-4 pb-2 bottom-0 text-shadow-sm text-lightTangerine bg-teal w-full">{subtitle}</p>
      </div>
    </a>
  );
};

export default Card;
