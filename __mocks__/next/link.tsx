import { MouseEvent } from "react";
import mockRouter from "next-router-mock";

type LinkProps = {
   children?: React.ReactNode;
   href: string;
   onClick?: () => void;
};

const Link = ({
   children,
   href,
   onClick: externalOnClick,
   ...props
}: LinkProps) => {
   const onClick = (e: MouseEvent) => {
      e.preventDefault();
      externalOnClick?.();
      mockRouter.push(href);
   };

   return (
      <a href={href} onClick={onClick} data-testid="mock-link" {...props}>
         {children}
      </a>
   );
};

module.exports = Link;
