import { FC } from "react";

import { cn } from "@/shared/cn";
import { Spinner } from '@/components/ui/spinner';
import { CategoryStatus, LangProgress, LangStatus } from './types';

const CATEGORY_LABELS: Record<string, string> = {
  versions: "Versions",
  skinlines: "Skinlines",
  champions: "Champions",
  skins: "Skins",
  chromas: "Chromas",
};

const categoryDot = (status: CategoryStatus) =>
  cn(
    "size-2 rounded-full shrink-0",
    status === "idle" && "bg-muted-foreground/30",
    status === "loading" && "bg-yellow-400 animate-pulse",
    status === "done" && "bg-green-400",
    status === "error" && "bg-red-400",
  );

const langBadge = (status: LangStatus) =>
  cn(
    "text-xs px-2 py-0.5 rounded-full font-medium",
    status === "idle" && "bg-muted text-muted-foreground",
    status === "loading" && "bg-yellow-400/20 text-yellow-400",
    status === "done" && "bg-green-400/20 text-green-400",
    status === "skipped" && "bg-muted text-muted-foreground",
    status === "error" && "bg-red-400/20 text-red-400",
  );

const RiotDataProgressLangCard: FC<{ lang: string; progress: LangProgress, className?: string }> = ({ lang, progress, className }) => (
  <div className={cn("rounded-lg border border-border bg-card p-4 flex flex-col gap-3", className)}>
    <div className="flex items-center justify-between">
      <span className="font-mono text-sm font-medium">{lang}</span>
      <span className={langBadge(progress.status)}>{progress.status}</span>
    </div>

    <div className="grid grid-cols-2 gap-1.5">
      {Object.entries(progress.categories).map(([key, status]) => (
        <div key={key} id={key} className="flex items-center gap-2">
          {status === 'loading' ? <Spinner className='size-2 text-yellow-400' /> : <div className={categoryDot(status)} />}
          <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[key]}</span>
        </div>
      ))}
    </div>

    {progress.timeSeconds !== undefined && (
      <div className="text-xs text-muted-foreground border-t pt-2">Loaded in {progress.timeSeconds}s</div>
    )}

    {progress.error && <div className="text-xs text-red-400 bg-red-400/10 rounded p-2">{progress.error}</div>}
  </div>
);

export default RiotDataProgressLangCard;
