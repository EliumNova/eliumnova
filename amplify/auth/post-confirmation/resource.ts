import { defineFunction } from "@aws-amplify/backend";

// Emails que quedan como administradores al crear su cuenta (separados por coma).
export const ADMIN_EMAILS = "";

export const postConfirmation = defineFunction({
  name: "post-confirmation",
  resourceGroupName: "auth",
  environment: { ADMIN_EMAILS },
});
