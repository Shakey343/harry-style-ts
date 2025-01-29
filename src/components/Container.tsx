import { ReactNode } from "react";
import cn from "../utils/cn";

const Container = ({
  children,
  className,
  id
}: {
  children: ReactNode;
  className: string;
  id?: string;
}) => {
  return (
    <div className={cn("px-20", className)} id={id}>
      {children}
    </div>
  );
};

export default Container;
