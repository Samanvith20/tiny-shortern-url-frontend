import { BarChart3, Globe2, Lock, MousePointerClick, Smartphone, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant short links",
    body: "Paste a URL, get a tidy /r/code in milliseconds. No signup, no friction.",
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    body: "Watch clicks roll in with a clean daily trend chart and totals you can trust.",
  },
  {
    icon: Smartphone,
    title: "Device breakdown",
    body: "Know whether your audience is on desktop, mobile, or tablet at a glance.",
  },
  {
    icon: Globe2,
    title: "Universal redirect",
    body: "Every link is a fast 302 that works anywhere the web does.",
  },
  {
    icon: Lock,
    title: "Validated inputs",
    body: "URLs are checked server-side so you never ship a broken link.",
  },
  {
    icon: MousePointerClick,
    title: "One-click copy",
    body: "Grab and share with a single tap from the dashboard or success card.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border/60 bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Why Trim
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Short links that actually tell you something.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Built for marketers, makers, and engineers who want a clean shortener without
            paying for a marketing suite.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="grid size-10 place-items-center rounded-lg bg-accent text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      title: "Paste your link",
      body: "Drop any long URL into the shortener. We validate it instantly.",
    },
    {
      n: "02",
      title: "Share the short one",
      body: "Copy your /r/code link and put it anywhere — tweets, emails, QR codes.",
    },
    {
      n: "03",
      title: "Track the clicks",
      body: "Open analytics for a daily trend line and a device-by-device split.",
    },
  ];
  return (
    <section id="how" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Three steps. Zero ceremony.
            </h2>
          </div>
          <a
            href="#shorten"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Try it now →
          </a>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="bg-card p-7">
              <span className="font-mono text-xs font-semibold tracking-wider text-primary">
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
