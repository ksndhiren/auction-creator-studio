import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ensureProfileAndOrganisation } from "@/lib/account.server";

export const ensureAccountSetup = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const admin = createSupabaseAdminClient();
    const {
      data: { user },
      error,
    } = await admin.auth.getUser(data.accessToken);

    if (error || !user) {
      throw new Error(error?.message || "Unable to verify the current user.");
    }

    return ensureProfileAndOrganisation(admin, user);
  });
