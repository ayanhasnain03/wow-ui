"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutIcon,
  ShoppingCartIcon,
  FileTextIcon,
  GlobeIcon,
  ZapIcon,
  CodeIcon
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  prompt: string;
}

const templates: Template[] = [
  {
    id: "landing",
    name: "Landing Page",
    description: "Modern marketing page",
    icon: LayoutIcon,
    prompt: "Create a beautiful landing page with hero section, features, and call-to-action"
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Online store",
    icon: ShoppingCartIcon,
    prompt: "Build an e-commerce site with product catalog, cart, and checkout"
  },
  {
    id: "blog",
    name: "Blog",
    description: "Content platform",
    icon: FileTextIcon,
    prompt: "Create a blog with article listing, categories, and reading experience"
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase work",
    icon: GlobeIcon,
    prompt: "Design a portfolio website with project gallery and about section"
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Analytics & data",
    icon: ZapIcon,
    prompt: "Build a dashboard with charts, metrics, and data visualization"
  },
  {
    id: "saas",
    name: "SaaS App",
    description: "Software product",
    icon: CodeIcon,
    prompt: "Create a SaaS application with authentication, main features, and settings"
  }
];

interface TemplateSelectorProps {
  onSelect: (prompt: string) => void;
  selectedTemplate: string | null;
}

export const TemplateSelector = ({ onSelect, selectedTemplate }: TemplateSelectorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground mb-6">Or start from a template</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.prompt)}
              className={cn(
                "group relative p-4 rounded-xl border transition-all duration-200 text-left",
                "hover:shadow-md hover:scale-[1.02]",
                isSelected
                  ? "border-primary/50 bg-primary/5 shadow-sm"
                  : "border-border/40 bg-card/50 hover:bg-card hover:border-border/60"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg border bg-background transition-colors shrink-0",
                    isSelected
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/40 group-hover:border-primary/20"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 transition-colors",
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-0.5">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

