import path from "path";
import fs from "fs";

export const CACHE_DIR = path.resolve(process.cwd(), "src/subprocess/gas.health/cache");
// Ensure the cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}
