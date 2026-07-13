/**
 * LandingOnlyApp — minimal mount for the public marketing page.
 * Bypasses Firebase, QueryClient, Tooltip, Router, Capacitor — everything
 * that might break the landing for visitors who don't have an account.
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NuminLanding from "./components/NuminLanding";
import NotFound from "./app/not-found";
import "./landing.css";

export default function LandingOnlyApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NuminLanding />} />
        <Route path="/home" element={<NuminLanding />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}