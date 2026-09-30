import { defineFunction } from "@aws-amplify/backend";

// Actualiza costos desde las planillas de proveedores cada hora (y a pedido desde el panel).
export const syncSuppliers = defineFunction({
  name: "sync-suppliers",
  resourceGroupName: "data",
  timeoutSeconds: 60,
  schedule: "every 1h",
});
