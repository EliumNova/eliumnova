import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";

// Login con email. El grupo ADMIN puede ver pedidos y manejar códigos.
// Más adelante los clientes se registran con el mismo sistema ("Mi cuenta").
export const auth = defineAuth({
  loginWith: { email: true },
  groups: ["ADMIN"],
  triggers: { postConfirmation },
  access: (allow) => [allow.resource(postConfirmation).to(["addUserToGroup"])],
});
