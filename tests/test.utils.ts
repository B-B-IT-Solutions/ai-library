import {JSX} from "react";
import {render, RenderResult, waitFor} from "@testing-library/react";

export const renderAsyncRSC = async <T>(
  asyncComponent: (props: T) => Promise<JSX.Element>,
  props: T
) => {
  const component = await asyncComponent(props);
  let result: RenderResult = {} as RenderResult;
  await waitFor(() => {
    result = render(component);
  });

  return {
    ...result,
  };
};

export const getElementById = (id: string): HTMLElement => {
  return document.getElementById(id) as HTMLElement;
};
