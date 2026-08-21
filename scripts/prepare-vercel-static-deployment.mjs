import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const outputPath = "/tmp/bora-piaui-vercel-deploy-input.json";
const assetsDirectory = path.join(projectRoot, "dist/public/assets");
const assetFiles = (await readdir(assetsDirectory))
  .sort()
  .map((asset) => path.join("dist/public/assets", asset));
const staticFiles = ["dist/public/index.html", ...assetFiles, "vercel.json"];

const files = await Promise.all(
  staticFiles.map(async (file) => ({
    file: file.replace(/^dist\/public\//, ""),
    data: await readFile(path.join(projectRoot, file), "utf8"),
    encoding: "utf-8",
  })),
);

await writeFile(
  outputPath,
  JSON.stringify({
    target: "production",
    teamId: "team_qOAT10qHChEuNWxXO0AQ5A8s",
    name: "bora-piaui",
    files,
  }),
);

console.log(outputPath);
