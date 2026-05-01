import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

type ProfileRow = {
  user_id: string;
  organisation_id: string | null;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

async function createOrganisation(admin: SupabaseClient, user: User) {
  const rawName =
    user.user_metadata.company_name ||
    user.user_metadata.company ||
    user.email?.split("@")[0] ||
    "Auction Graphics Studio";
  const baseSlug = slugify(rawName) || `org-${user.id.slice(0, 8)}`;
  const slug = `${baseSlug}-${user.id.slice(0, 8)}`;

  const { data, error } = await admin
    .from("organisations")
    .insert({
      name: rawName,
      slug,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Unable to create organisation: ${error.message}`);
  }

  return data.id as string;
}

export async function ensureProfileAndOrganisation(admin: SupabaseClient, user: User) {
  const { data: existingProfile, error: profileError } = await admin
    .from("profiles")
    .select("user_id, organisation_id")
    .eq("user_id", user.id)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    throw new Error(`Unable to load profile: ${profileError.message}`);
  }

  let organisationId = existingProfile?.organisation_id ?? null;

  if (!existingProfile) {
    const { error } = await admin.from("profiles").insert({
      user_id: user.id,
      email: user.email ?? null,
      full_name: user.user_metadata.full_name ?? null,
    });

    if (error) {
      throw new Error(`Unable to create profile: ${error.message}`);
    }
  }

  if (!organisationId) {
    organisationId = await createOrganisation(admin, user);
    const { error } = await admin
      .from("profiles")
      .update({
        organisation_id: organisationId,
        email: user.email ?? null,
        full_name: user.user_metadata.full_name ?? null,
      })
      .eq("user_id", user.id);

    if (error) {
      throw new Error(`Unable to attach organisation to profile: ${error.message}`);
    }
  }

  return {
    userId: user.id,
    organisationId,
    email: user.email ?? "",
    fullName: user.user_metadata.full_name ?? "",
  };
}
