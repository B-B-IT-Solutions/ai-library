import { execSync } from "node:child_process";
import path from "node:path";

// node_modules/.bin must be on PATH so Prisma can shell out to `tsx` for the seed script.
const binPath = path.resolve("node_modules/.bin");

//   Benötigte Umgebungsvariablen:
//   - USE_AZURE_IDENTITY=true
//   - AZURE_CLIENT_ID=<client-id-der-user-assigned-identity>
//   - DATABASE_URL=postgresql://<username>@<server>.postgres.database.azure.com:5432/<dbname>?sslmode=require

const log = (msg) => process.stdout.write(`[db-datainit] ${msg}\n`);

async function main() {
   log("Starting data init");

   if (process.env.USE_AZURE_IDENTITY === "true") {
      log("Azure Managed Identity enabled — fetching token");
      const { ManagedIdentityCredential } = await import("@azure/identity");

      const credential = new ManagedIdentityCredential({
         clientId: process.env.AZURE_CLIENT_ID,
      });

      log("Requesting token for client");
      const tokenResponse = await credential.getToken(
         "https://ossrdbms-aad.database.windows.net/.default"
      );
      log("Token acquired — injecting into DATABASE_URL");

      const url = new URL(process.env.DATABASE_URL);
      url.password = encodeURIComponent(tokenResponse.token);
      process.env.DATABASE_URL = url.toString();
   } else {
      log("Using static DATABASE_URL (no Azure identity)");
   }

   const execOptions = {
      stdio: "inherit",
      env: {
         ...process.env,
         PATH: `${binPath}${path.delimiter}${process.env.PATH}`,
      },
   };

   log("Running prisma db seed");
   execSync("node node_modules/prisma/build/index.js db seed", execOptions);
   log("Data populated successfully");
}

main().catch((err) => {
   process.stderr.write(`[db-datainit] FATAL: ${err?.stack ?? err}\n`);
   process.exit(1);
});
