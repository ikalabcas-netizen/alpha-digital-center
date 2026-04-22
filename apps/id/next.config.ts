import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Monorepo: trace files from monorepo root so workspace packages are bundled
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@adc/auth", "@adc/database"],
};

export default nextConfig;
