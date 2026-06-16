
import { Github } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-foreground text-background">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 17H7A5 5 0 0 1 7 7h2" />
              <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Trim</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#dashboard" className="transition-colors hover:text-foreground">Dashboard</a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/samanvith20"
            target="_blank"
            rel="noreferrer"
            className="hidden size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
            aria-label="GitHub"
          >
            <Github className="size-4" />
          </a>
          <a
            href="#shorten"
            className="inline-flex h-9 items-center rounded-md bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
