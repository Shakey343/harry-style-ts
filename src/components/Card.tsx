import cn from "../utils/cn";

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
      <div className={cn("h-[300px] border-8 border-teal relative", className)}>
        <div className="absolute hidden group-hover:block h-full w-full bg-black/20 transition-all"></div>
        <img src={imgUrl} alt="" className="h-full" />
      </div>
    </a>
  );
};

export default Card;
