import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
const title = "V connect outlook Add-in";
const rootElement = document.getElementById("container");
const root = createRoot(rootElement);
const renderApp = () => {
  root.render(
    <FluentProvider theme={webLightTheme}>
      <App title={title} />
    </FluentProvider>
  );
};
if (typeof Office !== "undefined" && Office.onReady) {
  Office.onReady(() => {
    renderApp();
  });
} else {
  setTimeout(() => {
    renderApp();
  }, 1000); 
}
