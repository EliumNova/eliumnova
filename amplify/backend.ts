import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { postConfirmation } from "./auth/post-confirmation/resource";
import { validateCoupon } from "./data/validate-coupon/resource";
import { placeOrder } from "./data/place-order/resource";
import { getCatalog } from "./data/get-catalog/resource";
import { syncSuppliers } from "./data/sync-suppliers/resource";

// Backend de EliumNova: usuarios (Cognito), base de datos (DynamoDB vía AppSync) y funciones (Lambda).
const backend = defineBackend({ auth, data, postConfirmation, validateCoupon, placeOrder, getCatalog, syncSuppliers });

// Contraseñas fuertes: mínimo 12 caracteres con mayúscula, minúscula, número y símbolo.
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    temporaryPasswordValidityDays: 3,
  },
};
