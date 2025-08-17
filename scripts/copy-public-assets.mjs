import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const pairs = [
  [path.join(root, "assets"), path.join(root, "build", "assets")],
  [path.join(root, "content"), path.join(root, "build", "content")]
];

async function copyDirIfExists(src, dest) {
  try {
    const stat = await fs.stat(src);
    if (!stat.isDirectory()) return;
  } catch {
    return; // src absent → skip
  }
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const st = await fs.stat(s);
    if (st.isDirectory()) {
      await copyDirIfExists(s, d);
    } else {
      await fs.copyFile(s, d);
    }
  }
}

(async () => {
  await Promise.all(pairs.map(([s, d]) => copyDirIfExists(s, d)));
  console.log("[postbuild] assets/content copied (if present).");
})();
