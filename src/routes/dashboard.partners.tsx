import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { partners } from "@/lib/mock-data";
import { UserPlus, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/dashboard/partners")({
  head: () => ({ meta: [{ title: "Partners — JMA Marketing Studio" }] }),
  component: PartnersPage,
});

const statusColor: Record<string, string> = {
  Active: "bg-gold text-gold-foreground",
  Pending: "bg-secondary text-foreground",
  Inactive: "bg-muted text-muted-foreground",
};

function PartnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="brand-kicker text-muted-foreground">Team</div>
          <h1 className="text-brand-display text-3xl">Partners</h1>
          <p className="text-muted-foreground">
            Manage facility marketers, event leads, and specialty auction collaborators.
          </p>
        </div>
        <Button className="bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 uppercase tracking-[0.18em] font-bold">
          <UserPlus className="mr-2 h-4 w-4" /> Invite Partner
        </Button>
      </div>

      <div className="overflow-hidden border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Company</th>
              <th className="hidden px-5 py-3 md:table-cell">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center bg-charcoal text-gold font-display text-xs">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="font-semibold">{p.name}</div>
                  </div>
                </td>
                <td className="px-5 py-4">{p.company}</td>
                <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">{p.email}</td>
                <td className="px-5 py-4">{p.role}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${statusColor[p.status]}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
