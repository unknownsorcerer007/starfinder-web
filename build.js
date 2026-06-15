// StarFinder Web - Local Code Obfuscation Build Script (build.js)
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Dependencies check
function setupObfuscator() {
  try {
    require("javascript-obfuscator");
    console.log("[Build] javascript-obfuscator is already installed.");
  } catch (err) {
    console.log("[Build] javascript-obfuscator not found. Installing...");
    try {
      execSync("npm install --no-audit --no-fund javascript-obfuscator", { stdio: "inherit" });
    } catch (e) {
      console.error("[Build] Error installing package. Please check npm connectivity.", e);
      process.exit(1);
    }
  }
}

function runBuild() {
  const Obfuscator = require("javascript-obfuscator");

  const backupDir = path.join(__dirname, "src_backup");
  const sourceFiles = [
    "app.js",
    "stars_db.js",
    "plate_solver.js",
    "solver_worker.js",
    "sw.js"
  ];

  // 1. Create a backup folder of raw editable source files if it doesn't exist yet
  if (!fs.existsSync(backupDir)) {
    console.log("[Build] Creating source backup directory: src_backup/");
    fs.mkdirSync(backupDir);
    sourceFiles.forEach(file => {
      if (fs.existsSync(path.join(__dirname, file))) {
        fs.copyFileSync(path.join(__dirname, file), path.join(backupDir, file));
        console.log(` - Backed up: ${file} -> src_backup/${file}`);
      }
    });
  } else {
    console.log("[Build] src_backup/ directory found. Restoring raw files to root before obfuscating...");
    // Restore files to root from backup so we always obfuscate the latest clean code
    sourceFiles.forEach(file => {
      const backupPath = path.join(backupDir, file);
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, path.join(__dirname, file));
      }
    });
  }

  console.log("\n[Build] Starting JS Code Obfuscation...");
  
  // Obfuscator options optimized for PWA execution and reverse engineering protection
  const options = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    numbersToExpressions: true,
    simplify: true,
    stringArray: true,
    stringArrayThreshold: 0.75,
    // Exclude DOM-bound globals to prevent reference breaks
    reservedNames: ["STARS_DB", "PlateSolver", "state", "TRANSLATIONS", "CONSTELLATION_INFO"],
    splitStrings: true,
    unicodeEscapeSequence: false
  };

  sourceFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(` - Obfuscating: ${file}...`);
      const code = fs.readFileSync(filePath, "utf8");
      const result = Obfuscator.obfuscate(code, options);
      fs.writeFileSync(filePath, result.getObfuscatedCode(), "utf8");
    }
  });

  console.log("\n[Build] Obfuscation Complete! Files in the root directory are now encrypted.");
  console.log("👉 IMPORTANT: Edit your files inside the 'src_backup/' folder, then run 'node build.js' to update the production files.");
}

setupObfuscator();
runBuild();
