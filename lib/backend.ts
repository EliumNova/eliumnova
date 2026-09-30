"use client";
// Conexión con el backend de AWS (Amplify). Si no hay backend desplegado,
// `hasBackend` es false y la tienda funciona sin servidor.
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

const out = outputs as Record<string, unknown>;
export const hasBackend = !!out.data && !!out.auth;

let configured = false;
export function configureAmplify() {
  if (!hasBackend || configured) return;
  Amplify.configure(outputs as Parameters<typeof Amplify.configure>[0]);
  configured = true;
}

type Client = ReturnType<typeof generateClient<Schema>>;
let publicClient: Client | null = null;
let adminClient: Client | null = null;

/** Cliente para visitantes (sin cuenta). */
export function publicApi() {
  configureAmplify();
  publicClient ??= generateClient<Schema>({ authMode: "identityPool" });
  return publicClient;
}

/** Cliente para usuarios con sesión (panel). */
export function userApi() {
  configureAmplify();
  adminClient ??= generateClient<Schema>({ authMode: "userPool" });
  return adminClient;
}

/** AWSJSON puede llegar como texto o como objeto. */
export function parseJson<T>(v: unknown): T {
  let x = v;
  for (let i = 0; i < 2 && typeof x === "string"; i++) x = JSON.parse(x);
  return x as T;
}
