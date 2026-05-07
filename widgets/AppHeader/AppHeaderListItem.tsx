import Link from 'next/link';
import { FC } from 'react';

import { NavigationMenuLink } from '@/components/ui/navigation-menu';

interface AppHeaderListItemProps {
  href: string;
  title: string;
  text?: string;
  active?: boolean;
}

const AppHeaderListItem: FC<AppHeaderListItemProps> = ({ href, title, text, active = false }) => {
  return (
    <li>
      <NavigationMenuLink asChild data-active={active} className='hover:bg-secondary/50'>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="font-medium">{title}</div>
            {text && <div className="line-clamp-2 text-muted-foreground">{text}</div>}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export default AppHeaderListItem;