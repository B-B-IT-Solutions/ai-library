import { ReactNode } from "react";

// Runner uses full-screen mode without app sidebar/header
type Props = {
   children: ReactNode;
};

const RunnerLayout = ({ children }: Props) => {
   return <div className="h-screen overflow-hidden">{children}</div>;
};

export default RunnerLayout;
