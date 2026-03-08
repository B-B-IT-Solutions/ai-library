import { execSync } from "node:child_process";

async function main() {
   if (process.env.USE_AZURE_IDENTITY === "true") {
      const { ManagedIdentityCredential } = await import("@azure/identity");

      const credential = new ManagedIdentityCredential({
         clientId: process.env.AZURE_CLIENT_ID,
      });

      const tokenResponse = await credential.getToken(
         "https://ossrdbms-aad.database.windows.net/.default"
      );

      const url = new URL(process.env.DATABASE_URL);
      url.password = encodeURIComponent(tokenResponse.token);
      process.env.DATABASE_URL = url.toString();
   }

   execSync("node node_modules/prisma/build/index.js migrate deploy", {
      stdio: "inherit",
   });
}

main().catch((err) => {
   console.error(err);
   process.exit(1);
});
