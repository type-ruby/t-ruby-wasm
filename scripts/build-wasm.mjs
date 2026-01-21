#!/usr/bin/env node

/**
 * Build script for T-Ruby WASM
 *
 * This script downloads and bundles the T-Ruby gem into the WASM distribution.
 * In production, this would fetch the gem from RubyGems and package it
 * with the Ruby WASM runtime.
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const distDir = join(rootDir, "dist");

console.log("Building T-Ruby WASM...");

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Build TypeScript
console.log("Compiling TypeScript...");
try {
  execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
  console.log("TypeScript compilation complete.");
} catch (error) {
  console.error("TypeScript compilation failed:", error.message);
  process.exit(1);
}

console.log("T-Ruby WASM build complete!");
console.log("");
console.log("To use in your project:");
console.log("  npm install @t-ruby/wasm");
console.log("");
console.log("Then import and use:");
console.log("  import { createTRuby } from '@t-ruby/wasm';");
console.log("  const tRuby = await createTRuby();");
