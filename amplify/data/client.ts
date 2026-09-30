// Cliente de datos para usar dentro de las funciones Lambda.
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";

type DataClientEnv = Parameters<typeof getAmplifyDataClientConfig>[0];
import type { Schema } from "./resource";

let client: ReturnType<typeof generateClient<Schema>> | null = null;

export async function dataClient() {
  if (client) return client;
  const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(process.env as unknown as DataClientEnv);
  Amplify.configure(resourceConfig, libraryOptions);
  client = generateClient<Schema>();
  return client;
}

/** Trae todas las páginas de una consulta list. */
export async function listAll<T>(fetchPage: (nextToken?: string | null) => Promise<{ data: T[]; nextToken?: string | null }>) {
  const out: T[] = [];
  let token: string | null | undefined = undefined;
  do {
    const page: { data: T[]; nextToken?: string | null } = await fetchPage(token);
    out.push(...(page.data ?? []));
    token = page.nextToken;
  } while (token);
  return out;
}
