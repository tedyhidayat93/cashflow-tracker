"use client"

import * as React from "react"
import { usePage } from "@inertiajs/react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import AppLogo from "./app-logo"
import { type SharedData } from '@/types'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navMain?: any[];
  projects?: any[];
  appName?: string;
  appSublabel?: string;
  user?: any;
}

export function AppSidebar({ 
  navMain, 
  projects, 
  appName, 
  appSublabel, 
  user,
  ...props 
}: AppSidebarProps) {
  const { auth, sidebarMenu } = usePage<SharedData>().props;

  // Resolusi data: Prioritaskan Props -> Inertia Shared Props -> Fallback Default
  const menuItems = navMain || sidebarMenu?.navMain || [];
  const projectItems = projects || sidebarMenu?.projects || [];
  const title = appName || sidebarMenu?.appName || 'App System';
  const sublabel = appSublabel || sidebarMenu?.appSublabel || 'Dashboard';
  const currentUser = user || auth?.user;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo name={title} sublabel={sublabel} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} />
        {projectItems.length > 0 && <NavProjects projects={projectItems} />}
      </SidebarContent>
      <SidebarFooter>
        {currentUser && <NavUser user={currentUser} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}