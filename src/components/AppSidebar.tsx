import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sparkles,
  LayoutTemplate,
  Images,
  Palette,
  Users,
  Settings,
  PlusSquare,
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
import { BrandMark } from "@/components/BrandMark";

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
        <Link to="/dashboard" className="px-2 py-4 group-data-[collapsible=icon]:px-0">
          <BrandMark
            compact
            inverted
            showTagline={false}
            className="group-data-[collapsible=icon]:justify-center"
          />
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
                    className="h-11 rounded-none border-l-2 border-transparent px-3 data-[active=true]:border-gold data-[active=true]:bg-sidebar-accent data-[active=true]:text-white data-[active=true]:font-semibold"
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
