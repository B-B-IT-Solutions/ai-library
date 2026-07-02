import { execSync } from "node:child_process";

//   In der Azure-Infrastruktur muss der Migration-Container folgende Umgebungsvariablen bekommen:
//   - USE_AZURE_IDENTITY=true
//   - AZURE_CLIENT_ID=<client-id-der-user-assigned-identity>
//   - DATABASE_URL=postgresql://<username>@<server>.postgres.database.azure.com:5432/<dbname>?sslmode=require

const log = (msg) => process.stderr.write(`[db-migrate] ${msg}\n`);

async function main() {
   log("Starting database migration");

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

   log("Running prisma migrate deploy");
   execSync("node node_modules/prisma/build/index.js migrate deploy", {
      stdio: "inherit",
   });
   log("Migration completed successfully");

   log("Running prisma db seed");
   execSync("node node_modules/prisma/build/index.js db seed", {
      stdio: "inherit",
   });
   log("Data populated successfully");
}

main().catch((err) => {
   process.stderr.write(`[db-migrate] FATAL: ${err?.stack ?? err}\n`);
   process.exit(1);
});
