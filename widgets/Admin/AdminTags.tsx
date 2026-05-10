"use client";
import { sample } from 'lodash';
import { FC } from 'react';

import { AppDataSkinline } from '@/types/appdata';

interface AdminTagsProps {
 skinlines: AppDataSkinline[];
}

const AdminTags: FC<AdminTagsProps> = ({ skinlines }) => {
  return <div className='grow'>{sample(skinlines)?.name}</div>
}

export default AdminTags;