import { defineFunction } from "@aws-amplify/backend";

export const validateCoupon = defineFunction({ name: "validate-coupon", resourceGroupName: "data" });
