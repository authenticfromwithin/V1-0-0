import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
if (!location.hash) location.hash = "#/home";
createRoot(document.getElementById("root")!).render(<App />);
