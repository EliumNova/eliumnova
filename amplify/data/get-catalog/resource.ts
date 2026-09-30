import { defineFunction } from "@aws-amplify/backend";

export const getCatalog = defineFunction({ name: "get-catalog", resourceGroupName: "data", timeoutSeconds: 15 });
