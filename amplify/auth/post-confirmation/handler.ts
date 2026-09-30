import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { AdminAddUserToGroupCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient();

// Si el email está en ADMIN_EMAILS, la cuenta nueva entra al grupo ADMIN.
export const handler: PostConfirmationTriggerHandler = async (event) => {
  const email = (event.request.userAttributes.email || "").toLowerCase();
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (email && admins.includes(email)) {
    await client.send(
      new AdminAddUserToGroupCommand({ GroupName: "ADMIN", Username: event.userName, UserPoolId: event.userPoolId }),
    );
  }
  return event;
};
