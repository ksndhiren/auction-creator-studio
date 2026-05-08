import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/partners")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
