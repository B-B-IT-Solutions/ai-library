import { MouseEvent } from "react";
import mockRouter from "next-router-mock";

const Link: React.FC<{ children?: React.ReactNode; href: string }> = ({
   children,
   href,
   ...props
}) => {
   const onClick = (e: MouseEvent) => {
      e.preventDefault();
      mockRouter.push(href);
   };

   return (
      <a href={href} onClick={onClick} data-testid="mock-link" {...props}>
         {children}
      </a>
   );
};

module.exports = Link;
