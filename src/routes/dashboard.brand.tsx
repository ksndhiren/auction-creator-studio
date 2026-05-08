import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/brand")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
