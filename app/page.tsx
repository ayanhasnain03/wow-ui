"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SparklesIcon } from "lucide-react";
import { ProjectForm } from "./components/project-form";
import { TemplateSelector } from "./components/template-selector";
import { ProjectList } from "./components/project-list";

const Page = () => {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const trpc = useTRPC();

  const { data: projects } = useQuery(
    trpc.projects.getMany.queryOptions()
  );

  const createProjectMutation = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Project created successfully: ${data?.name}`);
        router.push(`/projects/${data?.id}`);
      },
      onError: ({ data }) => {
        if (data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
        toast.error(data?.code ?? "Something went wrong");
      },
    })
  );

  const handleTemplateSelect = (prompt: string) => {
    setSelectedTemplate(prompt);
    createProjectMutation.mutate({ value: prompt });
  };

  const handleFormSubmit = (value: string) => {
    setSelectedTemplate(null);
    createProjectMutation.mutate({ value });
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 border border-primary/20 mb-2">
            <SparklesIcon className="size-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Create Your Project
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Describe what you want to build, or start from a template
          </p>
        </div>

        {/* Project Form */}
        <div className="mb-12">
          <ProjectForm
            onSubmit={handleFormSubmit}
            isPending={createProjectMutation.isPending}
          />
        </div>

        {/* Template Selector */}
        <div className="mb-16">
          <TemplateSelector
            onSelect={handleTemplateSelect}
            selectedTemplate={selectedTemplate}
          />
        </div>

        {/* Projects List */}
        <ProjectList projects={projects || []} />

        {/* Empty State */}
        {projects && projects.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted/40 border border-border/30 mb-4">
              <SparklesIcon className="size-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">
              No projects yet. Create your first project above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
