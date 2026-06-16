import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Copy, Check, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUrl, shortUrlFor } from "@/lib/api";
import type { ShortUrl } from "@/lib/types";

interface Props {
  variant?: "hero" | "card";
}

export function UrlCreator({ variant = "card" }: Props) {
  const [value, setValue] = useState("");
  const [created, setCreated] = useState<ShortUrl | null>(null);
  const [copied, setCopied] = useState(false);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (url: string) => createUrl(url),
    onSuccess: (data) => {
      setCreated(data);
      setValue("");
      qc.invalidateQueries({ queryKey: ["urls"] });
    },
  });

  const errMsg =
    mutation.error &&
    ((mutation.error as { response?: { data?: { error?: string } } }).response?.data?.error ??
      (mutation.error as Error).message ??
      "Something went wrong");

  const handleCopy = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(shortUrlFor(created.code));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? "rounded-2xl border border-border/70 bg-card/80 p-3 shadow-[var(--shadow-elegant)] backdrop-blur"
          : "rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) mutation.mutate(value.trim());
        }}
        className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
      >
        <div className="relative flex-1">
          <span className="pointer-events-none absolute top-1/2 left-4 hidden -translate-y-1/2 text-sm font-medium text-muted-foreground sm:block">
            https://
          </span>
          <Input
            type="url"
            required
            placeholder="paste a long link to shorten…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={mutation.isPending}
            className={
              isHero
                ? "h-14 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 sm:pl-20"
                : "h-12 sm:pl-20"
            }
          />
        </div>
        <Button
          type="submit"
          disabled={mutation.isPending || !value.trim()}
          className={
            isHero
              ? "h-14 gap-2 px-6 text-base font-semibold sm:min-w-44"
              : "h-12 gap-2 px-6 font-semibold sm:min-w-40"
          }
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Shortening
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Trim it
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {errMsg && (
        <div className="mx-2 mt-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errMsg}</span>
        </div>
      )}

      {created && (
        <div className="mx-2 mt-3 rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Your short link is ready
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-success uppercase">
              <span className="size-1.5 rounded-full bg-success" /> Live
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={shortUrlFor(created.code)}
              target="_blank"
              rel="noreferrer"
              className="truncate font-mono text-base font-semibold text-primary hover:underline"
            >
              {shortUrlFor(created.code)}
            </a>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="size-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" /> Copy link
                </>
              )}
            </Button>
          </div>
          <p className="mt-2 truncate text-sm text-muted-foreground">{created.originalUrl}</p>
        </div>
      )}
    </div>
  );
}
