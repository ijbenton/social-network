import { RenderOptions, render } from "@testing-library/react";
import React, { ReactElement } from "react";
import { Provider } from "react-redux";

import store from "../redux/store";

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
