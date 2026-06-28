import app from "./server";
import { createServer as createViteServer } from "vite";

async function startDevServer() {
  const PORT = 3000;
  
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  
  app.use(vite.middlewares);
  console.log("[PulseMind Dev] Vite development server mounted as middleware.");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PulseMind Dev] Server booting successfully on http://localhost:${PORT}`);
  });
}

startDevServer().catch((err) => {
  console.error("[PulseMind Dev] Critical server bootstrap failure:", err);
  process.exit(1);
});
