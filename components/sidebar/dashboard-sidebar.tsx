import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        HelloHelloHelloHelloHelloHe
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
