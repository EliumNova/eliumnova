import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { postConfirmation } from "./auth/post-confirmation/resource";
import { validateCoupon } from "./data/validate-coupon/resource";
import { placeOrder } from "./data/place-order/resource";
import { getCatalog } from "./data/get-catalog/resource";
import { syncSuppliers } from "./data/sync-suppliers/resource";

// Backend de EliumNova: usuarios (Cognito), base de datos (DynamoDB vía AppSync) y funciones (Lambda).
defineBackend({ auth, data, postConfirmation, validateCoupon, placeOrder, getCatalog, syncSuppliers });
