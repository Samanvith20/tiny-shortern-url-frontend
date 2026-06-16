import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalytics } from "@/lib/api";
import { AlertCircle, MousePointerClick } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

interface Props {
  code: string | null;
  originalUrl?: string;
  onClose: () => void;
}

export function AnalyticsDrawer({ code, originalUrl, onClose }: Props) {
  const open = code !== null;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["analytics", code],
    queryFn: () => getAnalytics(code!),
    enabled: open,
  });

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-xl">
        <SheetHeader className="p-0">
          <SheetTitle>Link Analytics</SheetTitle>
          <SheetDescription className="truncate">{originalUrl}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isLoading && (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          )}

          {isError && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{(error as Error).message ?? "Failed to load analytics"}</span>
            </div>
          )}

          {data && (
            <>
              <div className="rounded-lg border border-border bg-muted/40 p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MousePointerClick className="size-4" />
                  Total Clicks
                </div>
                <p className="mt-2 text-4xl font-semibold tracking-tight">{data.totalClicks}</p>
              </div>

              <section>
                <h3 className="mb-3 text-sm font-medium text-foreground">Clicks per day</h3>
                <div className="h-64 rounded-lg border border-border p-3">
                  {data.dailyClicks.length === 0 ? (
                    <EmptyChart label="No clicks recorded yet" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.dailyClicks}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis
                          dataKey="_id"
                          tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--color-popover)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="var(--color-chart-1)"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-medium text-foreground">Device breakdown</h3>
                <div className="h-64 rounded-lg border border-border p-3">
                  {data.deviceBreakdown.length === 0 ? (
                    <EmptyChart label="No device data yet" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.deviceBreakdown}
                          dataKey="count"
                          nameKey="_id"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {data.deviceBreakdown.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "var(--color-popover)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
