﻿import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
export default defineConfig({ plugins:[react()], root: __dirname, base:"/", build:{ outDir: resolve(__dirname,"../dist/admin"), emptyOutDir: false }, server:{ port:5174 } });
