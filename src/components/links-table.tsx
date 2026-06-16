import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Check,
  Copy,
  Link2Off,
  MousePointerClick,
  Search,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listUrls, shortUrlFor, simulateClick } from "@/lib/api";
import type { ShortUrl } from "@/lib/types";
import { AnalyticsDrawer } from "./analytics-drawer";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function LinksTable() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<ShortUrl | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["urls"],
    queryFn: listUrls,
  });

  const simulate = useMutation({
    mutationFn: (code: string) => simulateClick(code),
    onSuccess: (_d, code) => {
      qc.invalidateQueries({ queryKey: ["urls"] });
      qc.invalidateQueries({ queryKey: ["analytics", code] });
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (u) => u.originalUrl.toLowerCase().includes(q) || u.code.toLowerCase().includes(q),
    );
  }, [data, search]);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(shortUrlFor(code));
    setCopiedCode(code);
    setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 1500);
  };

  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Your Links</h2>
            <p className="text-sm text-muted-foreground">
              {data ? `${data.length} total` : "Loading…"}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search links…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {(error as Error).message ?? "Failed to load links"}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasQuery={search.length > 0} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-md border border-border md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Short URL</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.code}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <a
                            href={shortUrlFor(u.code)}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                           {u.code}
                          </a>
                          <button
                            onClick={() => handleCopy(u.code)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Copy short URL"
                          >
                            {copiedCode === u.code ? (
                              <Check className="size-3.5" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <a
                          href={u.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 truncate text-sm text-muted-foreground hover:text-foreground hover:underline"
                        >
                          <span className="truncate">{u.originalUrl}</span>
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {u.clickCount}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(u.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => simulate.mutate(u.code)}
                            disabled={simulate.isPending}
                            title="Simulate a click"
                          >
                            <MousePointerClick className="size-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setActive(u)}>
                            <BarChart3 className="size-4" />
                            Analytics
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <ul className="space-y-3 md:hidden">
              {filtered.map((u) => (
                <li
                  key={u.code}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={shortUrlFor(u.code)}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate font-mono text-sm font-medium hover:underline"
                        >
                          /r/{u.code}
                        </a>
                        <button
                          onClick={() => handleCopy(u.code)}
                          className="text-muted-foreground"
                          aria-label="Copy"
                        >
                          {copiedCode === u.code ? (
                            <Check className="size-3.5" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {u.originalUrl}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold tabular-nums">{u.clickCount}</p>
                      <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                        clicks
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => simulate.mutate(u.code)}
                        disabled={simulate.isPending}
                      >
                        <MousePointerClick className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setActive(u)}>
                        <BarChart3 className="size-4" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>

      <AnalyticsDrawer
        code={active?.code ?? null}
        originalUrl={active?.originalUrl}
        onClose={() => setActive(null)}
      />
    </Card>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Link2Off className="size-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-medium">
        {hasQuery ? "No links match your search" : "No links yet"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasQuery
          ? "Try a different keyword."
          : "Shorten your first URL above to get started."}
      </p>
    </div>
  );
}
