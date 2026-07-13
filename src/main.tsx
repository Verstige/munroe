import { createRoot } from "react-dom/client";
import LandingOnlyApp from "./LandingOnlyApp";
import App from "./App.tsx";
import "./index.css";

const isLandingRoute =
  window.location.pathname === "/" ||
  window.location.pathname === "/home";

createRoot(document.getElementById("root")!).render(
  isLandingRoute ? <LandingOnlyApp /> : <App />
);
