import app from "./server";
import path from "path";
import express from "express";

const PORT = 3000;

const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
console.log("[PulseMind Prod] Serving static production assets from:", distPath);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[PulseMind Prod] Server booting successfully on http://localhost:${PORT}`);
});
