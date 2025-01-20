import cn from "../utils/cn";

const Card = ({ imgUrl, className }: { imgUrl: string; className: string }) => {
  return (
    <div className={cn("h-[300px] border-8 border-teal", className)}>
      <img src={imgUrl} alt="" className="h-full" />
    </div>
  );
};

export default Card;
