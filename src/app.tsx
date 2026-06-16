import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BarChart3, MousePointerClick } from "lucide-react";
import { UrlCreator } from "@/components/url-creator";
import { LinksTable } from "@/components/links-table";
import { SiteHeader } from "@/components/site-header";
import { FeaturesSection, HowItWorksSection } from "@/components/landing-sections";
import { listUrls } from "@/lib/api";

export const Route = createFileRoute()({
  head: () => ({
    meta: [
      { title: "Trim — Short links with real analytics" },
      {
        name: "description",
        content:
          "Trim shortens your long URLs and tracks every click, device, and day — without the bloated marketing suite.",
      },
      { property: "og:title", content: "Trim — Short links with real analytics" },
      {
        property: "og:description",
        content: "Clean URL shortener with daily click trends and device breakdown.",
      },
    ],
  }),
  component: App,
});

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <FeaturesSection />
      <HowItWorksSection />
      <DashboardSection />
      <Footer />
    </div>
  );
}
function Hero() {
  const { data } = useQuery({ queryKey: ["urls"], queryFn: listUrls });
  const totalLinks = data?.length ?? 0;
  const totalClicks = data?.reduce((s, u) => s + u.clickCount, 0) ?? 0;

  return (
    <section id="shorten" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="absolute inset-0 -z-10 bg-radial-fade" />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-success" />
            Free forever · No account required
          </span>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl md:text-7xl">
            Tiny links.
            <br />
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Loud analytics.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Trim turns sprawling URLs into clean, trackable links — with a daily clicks chart
            and a device breakdown for every single one.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <UrlCreator variant="hero" />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Try it with any URL — your link appears in the dashboard below.
          </p>
        </div>

        {/* Live stat strip */}
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
          <Stat label="Links created" value={totalLinks.toLocaleString()} icon={<ArrowRight className="size-3.5" />} />
          <Stat label="Clicks tracked" value={totalClicks.toLocaleString()} icon={<MousePointerClick className="size-3.5" />} />
          <Stat label="Avg. per link" value={totalLinks > 0 ? Math.round(totalClicks / totalLinks).toLocaleString() : "0"} icon={<BarChart3 className="size-3.5" />} />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="px-4 py-5 text-center sm:px-6">
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 font-display text-2xl font-semibold tabular-nums sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function DashboardSection() {
  return (
    <section id="dashboard" className="border-t border-border/60 bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Your dashboard
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Every link, every click — in one place.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Search across links, copy with a tap, and dive into per-link analytics whenever
            you need them.
          </p>
        </div>
        <LinksTable />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded bg-foreground text-background">
            <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 17H7A5 5 0 0 1 7 7h2" />
              <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </span>
          <span className="font-display font-semibold text-foreground">Trim</span>
          <span className="text-muted-foreground">· Short links, real analytics.</span>
        </div>
        <p>© {new Date().getFullYear()} Trim. Crafted for fast links.</p>
      </div>
    </footer>
  );
}
