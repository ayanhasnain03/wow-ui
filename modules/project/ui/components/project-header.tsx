"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import {
  CheckIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  Trash2Icon,
  LayoutDashboardIcon,
  HomeIcon,
  SettingsIcon,
} from "lucide-react";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );
  const { theme, setTheme } = useTheme();

  const handleDelete = () => {
    console.log("Delete project:", projectId);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="flex h-12 items-center justify-between px-6">
        {/* Left: Project Info */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <div className="h-4 w-px bg-border/30" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-2.5 px-3 hover:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <div className="flex size-7 items-center justify-center rounded-lg border border-border/40 bg-background shadow-sm">
                  <Image
                    src="/logo.svg"
                    alt="VIBE"
                    width={16}
                    height={16}
                    className="shrink-0"
                  />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {project?.name || "Project"}
                </span>
                <ChevronDownIcon className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom" className="w-56">
              <DropdownMenuLabel className="px-3 py-2 text-xs font-medium text-muted-foreground">
                {project?.name || "Project"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <LayoutDashboardIcon className="size-4 mr-2" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2Icon className="size-4 mr-2" />
                <span>Delete Project</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <SettingsIcon className="size-4 mr-2" />
                  <span>Appearance</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="cursor-pointer"
                  >
                    <SunIcon className="size-4 mr-2" />
                    <span>Light</span>
                    {theme === "light" && <CheckIcon className="size-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer"
                  >
                    <MoonIcon className="size-4 mr-2" />
                    <span>Dark</span>
                    {theme === "dark" && <CheckIcon className="size-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="cursor-pointer"
                  >
                    <LayoutDashboardIcon className="size-4 mr-2" />
                    <span>System</span>
                    {theme === "system" && <CheckIcon className="size-4 ml-auto" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
