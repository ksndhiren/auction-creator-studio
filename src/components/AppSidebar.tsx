import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sparkles,
  LayoutTemplate,
  Images,
  Palette,
  Users,
  Settings,
  PlusSquare,
  Gavel,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutTemplate },
  { title: "Create Graphic", url: "/dashboard/create", icon: PlusSquare },
  { title: "Templates", url: "/dashboard/templates", icon: Sparkles },
  { title: "My Generations", url: "/dashboard/generations", icon: Images },
  { title: "Brand Kit", url: "/dashboard/brand", icon: Palette },
  { title: "Partners", url: "/dashboard/partners", icon: Users },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center bg-gold text-gold-foreground">
            <Gavel className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="font-display text-sm uppercase tracking-wider text-sidebar-foreground leading-tight group-data-[collapsible=icon]:hidden">
            Auction
            <div className="text-gold">Creative Studio</div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-sidebar-foreground/50">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-gold data-[active=true]:text-gold-foreground data-[active=true]:font-semibold"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
