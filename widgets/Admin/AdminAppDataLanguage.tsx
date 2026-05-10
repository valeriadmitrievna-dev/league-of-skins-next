/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDistance } from "date-fns";
import { RefreshCwIcon } from "lucide-react";
import { FC } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/shared/cn";
import { CategoryStatus, LangProgress, LangStatus } from "@/shared/riot/types";

interface AdminAppDataLanguageProps {
  language: string;
  data: LangProgress;
  onUpdate?: () => void;
}

const CATEGORY_LABELS = {
  versions: "Versions",
  champions: "Champions",
  skins: "Skins",
  chromas: "Chromas",
  skins_pbe: "Skins PBE",
  chromas_pbe: "Chromas PBE",
  skinlines: "Skinlines",
} as const;

const categoryDot = (status: CategoryStatus) =>
  cn("size-2 rounded-full shrink-0", {
    "bg-muted-foreground": status === "idle",
    "bg-yellow-400 animate-pulse": status === "loading",
    "bg-green-400": status === "done",
    "bg-red-400": status === "error",
  });

const langBadge = (status: LangStatus) =>
  cn(
    "text-xs px-2 py-0.5 rounded-full font-medium ml-auto",
    status === "idle" && "bg-muted text-muted-foreground",
    status === "loading" && "bg-yellow-400/20 text-yellow-400",
    status === "done" && "bg-green-400/20 text-green-400",
    status === "skipped" && "bg-muted text-muted-foreground",
    status === "error" && "bg-red-400/20 text-red-400",
  );

const AdminAppDataLanguage: FC<AdminAppDataLanguageProps> = ({ language, data, onUpdate }) => {
  const updateDistance =
    data.lastUpdate &&
    formatDistance(new Date(data.lastUpdate), new Date(), {
      addSuffix: true,
    });

  return (
    <div className="rounded-lg bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-x-2">
        <span className="font-mono text-sm font-medium">{language}</span>
        {data.lastUpdate && (
          <>
            <Badge variant="secondary" className="mr-auto">
              {updateDistance === "less than a minute ago" ? "just now" : updateDistance}
            </Badge>
          </>
        )}
        <span className={langBadge(data.status)}>{data.status}</span>
        {onUpdate && (
          <Button size="icon-xs" variant="outline" onClick={onUpdate} disabled={data.status === 'loading'}>
            <RefreshCwIcon />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
          const status: CategoryStatus =
            (data.categories as any)?.[category] ?? ((data.counts as any)?.[category] ? "done" : "idle");
          return (
            <div key={category} id={category} className="flex items-center gap-2">
              {status === "loading" ? (
                <Spinner className="size-2 text-yellow-400" />
              ) : (
                <div className={categoryDot(status)} />
              )}
              <span className="text-xs text-muted-foreground">
                {label}
                {typeof (data.counts as any)?.[category] === 'number' && ` - ${(data.counts as any)?.[category]}`}
              </span>
            </div>
          );
        })}
      </div>

      {data.timeSeconds !== undefined && (
        <div className="text-xs text-muted-foreground border-t pt-2">Loaded in {data.timeSeconds}s</div>
      )}

      {data.error && <div className="text-xs text-red-400 bg-red-400/10 rounded p-2">{data.error}</div>}
    </div>
  );
};

export default AdminAppDataLanguage;
