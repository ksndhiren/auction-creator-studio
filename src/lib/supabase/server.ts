import { createClient } from "@supabase/supabase-js";

function getServerEnv(name: keyof NodeJS.ProcessEnv) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

export function createSupabaseAdminClient() {
  const adminKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!adminKey) {
    throw new Error(
      "Missing required server environment variable: SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(getServerEnv("SUPABASE_URL"), adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
