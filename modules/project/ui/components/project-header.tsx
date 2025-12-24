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
} from "lucide-react";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );
  const { setTheme } = useTheme();

  const handleDelete = () => {
    console.log("Delete project:", projectId);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center justify-center px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 gap-2 px-3 hover:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <div className="flex size-6 items-center justify-center rounded-md border border-border/60 bg-background">
                <Image
                  src="/logo.svg"
                  alt="VIBE"
                  width={14}
                  height={14}
                  className="shrink-0"
                />
              </div>
              <span className="text-sm font-medium text-foreground">
                {project?.name || "Project"}
              </span>
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="bottom" className="w-56">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-muted-foreground">
              {project?.name || "Project"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="cursor-pointer">
                <LayoutDashboardIcon className="size-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2Icon className="size-4" />
              <span>Delete Project</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Appearance</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="cursor-pointer"
                >
                  <SunIcon className="size-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer"
                >
                  <MoonIcon className="size-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="cursor-pointer"
                >
                  <LayoutDashboardIcon className="size-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
