Open your tsconfig.json and ensure the following under "compilerOptions":

{
  "baseUrl": "src",
  "paths": {
    "@/*": ["*"],
    "components/*": ["components/*"],
    "styles/*": ["styles/*"],
    "logic/*": ["logic/*"]
  }
}

This keeps Vite and TypeScript aligned for aliases already used in code.
