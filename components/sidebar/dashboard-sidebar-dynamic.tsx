import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';

export function DashboardSidebarDynamic() {
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
