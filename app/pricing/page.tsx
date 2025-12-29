"use client";

import Image from "next/image";
import { PricingTable } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* soft blobs */}
        <div className="absolute -top-48 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 via-fuchsia-500/10 to-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-60 right-[-160px] h-[640px] w-[640px] rounded-full bg-gradient-to-tr from-primary/15 via-emerald-400/10 to-transparent blur-3xl" />

        {/* grid + vignette */}
        <div className="absolute inset-0 opacity-[0.14] dark:opacity-[0.08] [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* Header */}
        <header className="mx-auto w-full max-w-3xl text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-primary/15 blur-xl" />
              <Image
                src="/logo.svg"
                alt="Logo"
                width={44}
                height={44}
                className="relative hidden md:block opacity-90"
                priority
              />
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/35 dark:bg-card/25 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
              Simple pricing • Cancel anytime
            </span>
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Pricing that feels premium
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Choose a plan and start building. Upgrade or downgrade anytime —
            clean, transparent, and smooth.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/60 bg-card/30 dark:bg-card/20 px-3 py-1 backdrop-blur">
              Secure checkout
            </span>
            <span className="rounded-full border border-border/60 bg-card/30 dark:bg-card/20 px-3 py-1 backdrop-blur">
              Instant access
            </span>
            <span className="rounded-full border border-border/60 bg-card/30 dark:bg-card/20 px-3 py-1 backdrop-blur">
              Priority support
            </span>
          </div>
        </header>

        {/* Pricing */}
        <main className="mt-10 flex flex-1 items-start justify-center sm:mt-12 md:mt-16">
          <div className="w-full max-w-5xl">
            <section
              className={cn(
                "relative overflow-hidden rounded-3xl ",
                "p-5 "
              )}
            >
              <div className="relative z-10 w-full">
                <PricingTable
                appearance={{
                  elements:{
                    pricingTableCard:"border! border-border/40 bg-card/50 backdrop-blur-sm shadow-sm p-6 md:p-8 hover:border-border/60 hover:shadow-md",
                  },
                }}
                />
              </div>
            </section>

            <div className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-foreground/70 dark:text-muted-foreground/60 sm:text-sm">
              All plans include access to our AI-powered project generator and
              priority support. Need team billing? Contact us.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
