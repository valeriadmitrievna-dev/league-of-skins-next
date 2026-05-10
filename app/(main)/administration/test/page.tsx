import { getT } from 'next-i18next/server';

import { getLangAppData } from '@/shared/utils/getLangAppData';
import AdminTags from '@/widgets/Admin/AdminTags';

const AdministrationTest = async () => {
  const { i18n } = await getT();

  const data = await getLangAppData(i18n.language);
  const skinlines = data?.skinlines ?? [];

  return <AdminTags skinlines={skinlines} />
};

export default AdministrationTest;
