import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable automatic generation of AGENTS.md / CLAUDE.md metadata files
  agentRules: false,
};

export default nextConfig;
