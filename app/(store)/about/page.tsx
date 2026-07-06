import React from 'react';
import { getWebsiteSetting } from '../../../actions/settings';
import { Badge } from '../../../components/Badge';
import { Breadcrumbs } from '../../../components/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const settings = await getWebsiteSetting('about_settings') || {
    title: 'About Learn Vault',
    story: 'Learn Vault was founded to provide immediate access to structured, action-oriented knowledge. We specialize in four core pillars of human life: Education, Wealth, Health, and Relationships. Our carefully curated books and insightful blog posts are designed to help you build a better future, one page at a time.',
    mission: 'To empower readers with direct, uninhibited access to premium digital resources without accounts or clutter.',
  };

  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'About Us', href: '/about' }]} />

        {/* Heading */}
        <div className="space-y-4">
          <Badge variant="secondary">Our Philosophy</Badge>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900">
            {settings.title}
          </h1>
        </div>

        {/* Article Grid */}
        <div className="prose prose-zinc dark:prose-invert font-sans text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-6">
          <p className="whitespace-pre-wrap leading-loose">
            {settings.story}
          </p>

          <div className="rounded-2xl border border-zinc-200/50 bg-[#FAF7F0] p-6 sm:p-8 mt-10">
            <h2 className="font-serif text-lg font-bold text-zinc-900 mb-2">Our Core Mission</h2>
            <p className="text-sm leading-relaxed italic text-zinc-600">
              "{settings.mission}"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
