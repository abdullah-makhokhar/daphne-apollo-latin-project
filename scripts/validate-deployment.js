#!/usr/bin/env node

/**
 * Startup Validation Script for Vercel Deployment
 * 
 * This script validates the deployment environment before the API starts.
 * Run this as a preliminary check to catch configuration issues early.
 * 
 * Usage: node scripts/validate-deployment.js
 */

import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const __dirname = new URL(".", import.meta.url).pathname;
const rootDir = resolve(__dirname, "..");

interface ValidationResult {
  passed: boolean;
  checks: {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

const result: ValidationResult = {
  passed: true,
  checks: [],
};

function addCheck(
  name: string,
  passed: boolean,
  message: string
): void {
  result.checks.push({
    name,
    passed,
    message,
  });
  if (!passed) {
    result.passed = false;
  }
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} ${name}: ${message}`);
}

console.log("🔍 Validating Vercel Deployment...\n");

// Check 1: Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0], 10);
  const versionOk = majorVersion >= 20;
  addCheck(
    "Node.js Version",
    versionOk,
    `Using ${nodeVersion}${versionOk ? " (>= 20)" : " (< 20, upgrade recommended)"}`
  );
} catch (e) {
  addCheck("Node.js Version", false, "Unable to determine version");
}

// Check 2: Environment variables
const requiredEnvVars = ["NODE_ENV"];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);

addCheck(
  "Environment Variables",
  missingEnvVars.length === 0,
  missingEnvVars.length === 0
    ? "All required variables set"
    : `Missing: ${missingEnvVars.join(", ")}`
);

// Check 3: API handler exists
try {
  const apiPath = resolve(rootDir, "api", "index.ts");
  const apiExists = existsSync(apiPath);
  addCheck(
    "API Handler",
    apiExists,
    apiExists ? "api/index.ts found" : "api/index.ts not found"
  );
} catch (e) {
  addCheck("API Handler", false, "Error checking api/index.ts");
}

// Check 4: vercel.json exists and is valid
try {
  const vercelJsonPath = resolve(rootDir, "vercel.json");
  const vercelJsonExists = existsSync(vercelJsonPath);
  if (vercelJsonExists) {
    const content = readFileSync(vercelJsonPath, "utf-8");
    const config = JSON.parse(content);
    const isValid = config.version === 2 && config.buildCommand;
    addCheck(
      "vercel.json",
      isValid,
      isValid ? "Valid Vercel configuration" : "Invalid configuration"
    );
  } else {
    addCheck("vercel.json", false, "vercel.json not found");
  }
} catch (e) {
  addCheck("vercel.json", false, `Error validating: ${(e as Error).message}`);
}

// Check 5: .env.example exists (for documentation)
try {
  const envExamplePath = resolve(rootDir, ".env.example");
  const envExampleExists = existsSync(envExamplePath);
  addCheck(
    "Environment Documentation",
    envExampleExists,
    envExampleExists
      ? ".env.example found - good for documentation"
      : ".env.example not found"
  );
} catch (e) {
  addCheck(
    "Environment Documentation",
    false,
    "Error checking .env.example"
  );
}

// Check 6: pnpm-lock.yaml exists (for reproducible builds)
try {
  const lockfilePath = resolve(rootDir, "pnpm-lock.yaml");
  const lockfileExists = existsSync(lockfilePath);
  addCheck(
    "Lock File",
    lockfileExists,
    lockfileExists ? "pnpm-lock.yaml found" : "pnpm-lock.yaml not found"
  );
} catch (e) {
  addCheck("Lock File", false, "Error checking lock file");
}

// Check 7: package.json files exist
try {
  const rootPkgPath = resolve(rootDir, "package.json");
  const apiPkgPath = resolve(rootDir, "api", "package.json");
  const rootExists = existsSync(rootPkgPath);
  const apiExists = existsSync(apiPkgPath);
  const pkgFilesOk = rootExists && apiExists;
  addCheck(
    "Package Files",
    pkgFilesOk,
    pkgFilesOk
      ? "Root and api package.json found"
      : "Missing package.json files"
  );
} catch (e) {
  addCheck("Package Files", false, "Error checking package.json files");
}

// Summary
console.log("\n" + "=".repeat(50));
if (result.passed) {
  console.log(
    "✅ All checks passed! Deployment is ready for Vercel.\n"
  );
  process.exit(0);
} else {
  console.log(
    `❌ ${result.checks.filter((c) => !c.passed).length} check(s) failed.\n`
  );
  console.log("Failed checks:");
  result.checks
    .filter((c) => !c.passed)
    .forEach((c) => console.log(`  - ${c.name}: ${c.message}`));
  console.log("\n⚠️  Please fix the issues above before deploying to Vercel.\n");
  process.exit(1);
}
