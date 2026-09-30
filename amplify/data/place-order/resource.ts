import { defineFunction } from "@aws-amplify/backend";

export const placeOrder = defineFunction({ name: "place-order", resourceGroupName: "data", timeoutSeconds: 15 });
