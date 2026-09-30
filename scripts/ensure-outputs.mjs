// Amplify genera amplify_outputs.json al desplegar el backend.
// Si no existe (por ejemplo, en una compu sin backend), se crea vacío y la web
// funciona en modo sin servidor: catálogo local y pedidos solo por WhatsApp.
import { existsSync, writeFileSync } from "node:fs";
if (!existsSync("amplify_outputs.json")) writeFileSync("amplify_outputs.json", "{}\n");
