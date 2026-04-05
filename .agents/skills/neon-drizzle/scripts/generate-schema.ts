/**
 * Generate Schema Script
 *
 * Generates Drizzle migration files based on schema changes.
 * Run with: npx drizzle-kit generate
 *
 * This creates SQL migration files in the migrations directory
 * based on differences between your schema.ts and the database.
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function generateSchema() {
  console.log("🔄 Generating Drizzle migrations...\n");

  try {
    const { stdout, stderr } = await execAsync("npx drizzle-kit generate");

    if (stdout) {
      console.log("📝 Generated migrations:");
      console.log(stdout);
    }

    if (stderr) {
      console.warn("⚠️  Warnings:");
      console.warn(stderr);
    }

    console.log("\n✅ Migration generation complete!");
    console.log("\n📋 Next steps:");
    console.log(
      "   1. Review the generated migration files in ./src/db/migrations",
    );
    console.log("   2. Run: npx drizzle-kit migrate");
    console.log("   3. Test your application\n");

    return true;
  } catch (error) {
    console.error("❌ Migration generation failed");
    console.error((error as any).message);

    console.log("\n💡 Troubleshooting:");
    console.log("   • Ensure drizzle.config.ts is in your project root");
    console.log("   • Check that DATABASE_URL is set correctly");
    console.log(
      "   • Verify your schema.ts file exists at the configured path",
    );
    console.log("   • Review guides/troubleshooting.md for common issues");
    console.log("   • See references/migrations.md for migration patterns");

    const errorMessage = (error as any).message.toLowerCase();

    if (errorMessage.includes("url") || errorMessage.includes("undefined")) {
      console.log("\n⚠️  Environment variable issue detected:");
      console.log("   • Ensure DATABASE_URL is loaded in drizzle.config.ts");
      console.log(
        '   • Add: import { config } from "dotenv"; config({ path: ".env.local" });',
      );
      console.log(
        '   • See guides/troubleshooting.md section: "Error: url: undefined"',
      );
    }

    if (errorMessage.includes("schema") || errorMessage.includes("not found")) {
      console.log("\n⚠️  Schema file issue detected:");
      console.log(
        "   • Verify schema path in drizzle.config.ts matches actual file location",
      );
      console.log("   • Default: ./src/db/schema.ts");
    }

    if (errorMessage.includes("enoent")) {
      console.log("\n⚠️  File/directory missing:");
      console.log("   • Create migrations folder: mkdir -p src/db/migrations");
      console.log("   • Ensure schema file exists: src/db/schema.ts");
    }

    return false;
  }
}

generateSchema().then((success) => {
  process.exit(success ? 0 : 1);
});
