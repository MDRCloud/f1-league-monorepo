
import { execSync } from "node:child_process";
try {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  execSync("node dist/prisma/seed-runner.js", { stdio: "inherit" });
} catch (e) {
  console.error(e);
  process.exit(1);
}
