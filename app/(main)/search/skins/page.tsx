import SearchSkinsFilters from '@/widgets/SearchSkins/SearchSkinsFilters';
import SearchSkinsInput from '@/widgets/SearchSkins/SearchSkinsInput';
import SearchSkinsResult from '@/widgets/SearchSkins/SearchSkinsResult';
import { FC } from 'react';

const SearchSkins: FC = async () => {
  return (
    <div className='w-full md:grid grid-cols-[280px_1fr] gap-6'>
      <SearchSkinsFilters />
      <div className='pb-10'>
        <div className='mb-4'>
          <SearchSkinsInput />
        </div>
        <SearchSkinsResult />
      </div>
    </div>
  );
};

export default SearchSkins;
