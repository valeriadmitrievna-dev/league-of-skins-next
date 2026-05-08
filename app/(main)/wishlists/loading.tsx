// import LoadingScreen from '@/components/LoadingScreen';

import Skeleton from '@/components/Skeleton';
import { Typography } from "@/components/Typography";

const Loading = () => {
  // return <LoadingScreen className='fixed size-full left-0 top-0' />
  return (
    <section>
      <Typography.H3>Мои Вишлисты</Typography.H3>
      <div className="mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        <Skeleton asChild count={3} className='h-64.5' />
      </div>
    </section>
  );
};

export default Loading;
