import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BookText, Calendar, Home, Inbox, LibraryBig } from "lucide-react";

export function AppSidebar() {
  const items = [
    {
      title: "Levels",
      url: "/levels",
      icon: Home,
    },
    {
      title: "Students",
      url: "/students",
      icon: Inbox,
    },
    {
      title: "Books",
      url: "/books",
      icon: BookText,
    },
    {
      title: "Books Distribution",
      url: "/books-distribution",
      icon: LibraryBig,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>School System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
