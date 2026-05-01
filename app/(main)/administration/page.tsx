import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogs from "@/widgets/Admin/AdminLogs";

const AppData = () => {
  return <>appData</>
}

const AdministrationPage = () => {
  const tabCN = "grow-0! shrink! h-fit text-base px-3 py-1.5 justify-between";
  const tabContentCN = "bg-muted/50 overflow-hidden";

  return (
    <Tabs
      defaultValue="logs"
      orientation="vertical"
      className="size-full h-[calc(100vh-65px-40px)] overflow-hidden grid grid-cols-[200px_1fr]"
    >
      <TabsList className="h-full! w-full justify-start gap-y-1 p-2">
        <TabsTrigger className={tabCN} value="logs">
          Logs
        </TabsTrigger>
        <TabsTrigger className={tabCN} value="appdata">
          App Data
        </TabsTrigger>
      </TabsList>
      <TabsContent className={tabContentCN} value="logs">
        <AdminLogs />
      </TabsContent>
      <TabsContent className={tabContentCN} value="appdata">
        <ScrollArea className="size-full">AppData</ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default AdministrationPage;
