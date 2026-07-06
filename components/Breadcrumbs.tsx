import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://learnvault.com';
  
  // Construct JSON-LD Schema
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': siteUrl,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 2,
        'name': item.label,
        'item': item.href.startsWith('http') ? item.href : `${siteUrl}${item.href}`,
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-col', className)}>
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <ol className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={item.href + index}>
              <li className="text-zinc-400">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                {isLast ? (
                  <span className="font-medium text-zinc-800 dark:text-zinc-200" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
