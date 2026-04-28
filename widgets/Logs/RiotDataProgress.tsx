"use client";
import { FC, Fragment, useEffect, useRef, useState } from "react";

import RiotIcon from "@/shared/client/assets/riot-games.svg";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/shared/client/utils/cn";
import type { RiotProgress, LangProgress, CategoryStatus, LangStatus } from "@/lib/riotProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiotDataProgressLangCard from "./RiotDataProgressLangCard";
import { ScrollArea } from "@/components/ui/scroll-area";

const globalBadge = (status: RiotProgress["status"]) =>
  cn(
    "text-xs px-2 py-0.5 rounded-full font-medium",
    status === "idle" && "bg-muted text-muted-foreground",
    status === "running" && "bg-yellow-400/20 text-yellow-400",
    status === "done" && "bg-green-400/20 text-green-400",
    status === "error" && "bg-red-400/20 text-red-400",
  );

const RiotDataProgress: FC = () => {
  const [progress, setProgress] = useState<RiotProgress | null>(null);
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let es: EventSource;

    const connect = () => {
      es = new EventSource("/api/riot-progress");
      es.onmessage = (e) => setProgress(JSON.parse(e.data));
      es.onerror = () => {
        es.close();
        setTimeout(connect, 2000);
      };
    };

    connect();
    return () => es?.close();
  }, []);

  return (
    <Sheet open>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <RiotIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false} className="w-150 max-w-full! flex flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center justify-between">
            <span>Riot Data</span>
            {progress && <span className={globalBadge(progress.status)}>{progress.status}</span>}
          </SheetTitle>
          {progress?.startedAt && (
            <p className="text-xs text-muted-foreground">
              Started {new Date(progress.startedAt).toLocaleTimeString()}
              {progress.finishedAt && ` · Finished ${new Date(progress.finishedAt).toLocaleTimeString()}`}
            </p>
          )}
        </SheetHeader>

        <Tabs defaultValue="logs" className="h-full overflow-hidden gap-y-0">
          <TabsList variant="line" className="w-full border-b">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="logs">Logs{progress?.logs.length ? ` (${progress.logs.length})` : ""}</TabsTrigger>
          </TabsList>
          <TabsContent value="status" asChild>
            <ScrollArea className="p-4">
              {!progress || Object.keys(progress.languages).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No data loading in progress</p>
              ) : (
                Object.entries(progress.languages).map(([lang, langProgress]) => (
                  <RiotDataProgressLangCard key={lang} lang={lang} progress={langProgress} className="not-last:mb-4" />
                ))
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="logs" asChild>
            <ScrollArea ref={logsRef} className="p-4 font-mono text-xs flex flex-col gap-1 h-full overflow-y-auto">
              {!progress?.logs.length ? (
                <p className="text-muted-foreground text-center py-8">No logs yet</p>
              ) : (
                progress.logs.map((log, i) => (
                  <div
                    key={i}
                    className={cn("py-0.5", {
                      "text-muted-foreground": log.type === "default",
                      "text-success": log.type === "success",
                      "text-destructive": log.type === "error",
                      "text-yellow-400": log.type === "warning",
                    })}
                  >
                    {log.message.split(" ").map((part, index) => {
                      return (
                        <Fragment key={index}>
                          {!!index && " "}
                          {part.startsWith("http") ? (
                            <a href={part} target="_blank" className="underline">
                              {part.endsWith('.json') ? part.split('/')[part.split('/').length - 1] : 'link'}
                            </a>
                          ) : (
                            part
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default RiotDataProgress;
