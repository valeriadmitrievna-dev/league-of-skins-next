import Background from "@/components/Background";
import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <Background />
      <Spinner className="size-10 text-primary" />
    </div>
  );
};

export default Loading;
