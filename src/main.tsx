
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply the stored theme immediately, before React hydration
const storedTheme = localStorage.getItem("theme") || "system";
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (storedTheme === "dark" || (storedTheme === "system" && prefersDark)) {
  document.documentElement.classList.add("dark");
  document.documentElement.classList.remove("light");
} else {
  document.documentElement.classList.add("light");
  document.documentElement.classList.remove("dark");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
