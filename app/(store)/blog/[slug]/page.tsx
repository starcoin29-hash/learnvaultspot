import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getBlogPostBySlug, getBlogPosts } from '../../../../actions/blog';
import { Badge } from '../../../../components/Badge';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { generateSEOMetadata, generateArticleSchema } from '../../../../lib/seo';
import { formatDate } from '../../../../utils/date';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { ShareButtons } from '../../../../components/ShareButtons';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Learn Vault',
    };
  }

  return generateSEOMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.shortDescription,
    image: post.coverImage,
    slug: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedDate.toISOString(),
    author: post.author,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch all posts to determine related articles
  const allPosts = await getBlogPosts();
  const relatedArticles = allPosts
    .filter((p) => p.categoryId === post.categoryId && p.id !== post.id)
    .slice(0, 3);

  // Construct Article JSON-LD Schema
  const schemaData = generateArticleSchema({
    title: post.title,
    description: post.shortDescription,
    image: post.coverImage,
    author: post.author,
    publishedDate: post.publishedDate.toISOString(),
    slug: post.slug,
  });

  const postUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://learnvault.com'}/blog/${post.slug}`;

  return (
    <div className="w-full bg-[#FCFBF9] text-zinc-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        {/* Main Article Header */}
        <div className="space-y-6 text-center md:text-left">
          <Badge variant="secondary">{post.category?.name}</Badge>
          
          <h1 className="font-serif text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-zinc-950 leading-tight">
            {post.title}
          </h1>

          <p className="text-zinc-500 font-sans text-sm sm:text-base leading-relaxed max-w-2xl italic">
            {post.shortDescription}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 border-t border-zinc-100 font-sans text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-zinc-400" />
              <span>By <strong className="text-zinc-700">{post.author}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-zinc-400" />
              <span>Published: <strong className="text-zinc-700">{formatDate(post.publishedDate)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-400" />
              <span>Read Time: <strong className="text-zinc-700">{post.readingTime} min read</strong></span>
            </div>
          </div>
        </div>

        {/* Article Cover Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm border border-zinc-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
            className="object-cover"
          />
        </div>

        {/* Article Content Layout */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start pt-6">
          
          {/* Left Column: Post Body */}
          <div className="lg:col-span-8 prose prose-zinc dark:prose-invert font-sans text-sm sm:text-base leading-loose text-zinc-700 space-y-6">
            <div className="leading-relaxed">
              {renderBlogContent(post.content)}
            </div>

            {/* Social Sharing block */}
            <ShareButtons postUrl={postUrl} postTitle={post.title} />
          </div>

          {/* Right Column: Sidebar CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-zinc-200/50 bg-[#FAF7F0] p-6 space-y-4">
              <h3 className="font-serif text-base font-bold">Recommended Resource</h3>
              <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                Looking for actionable guidebooks to study these concepts further? Explore the Bookstore.
              </p>
              <Link
                href="/books"
                className="w-full inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-800"
              >
                Go to Bookstore
              </Link>
            </div>
          </div>

        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-zinc-100 pt-16 space-y-8">
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight">Related Articles</h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">Explore matching subjects</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {relatedArticles.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 border-b border-zinc-50">
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 250px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[9px] uppercase font-semibold text-zinc-400">{p.category?.name}</span>
                    <h3 className="mt-1 font-serif text-sm font-bold text-zinc-900 group-hover:text-zinc-700 line-clamp-2">
                      {p.title}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center text-[10px] font-semibold text-zinc-900 group-hover:text-zinc-600">
                      Read Article <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper to render Markdown links securely in Server Components
function renderBlogContent(content: string) {
  // Regex to match Markdown links: [Label text](url)
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = content.split(mdLinkRegex);
  
  if (parts.length === 1) {
    return <p className="whitespace-pre-line leading-relaxed">{content}</p>;
  }

  const renderedElements = [];
  let partIndex = 0;
  
  while (partIndex < parts.length) {
    // Normal text
    const textSegment = parts[partIndex++];
    if (textSegment) {
      renderedElements.push(
        <span key={`text-${partIndex}`} className="whitespace-pre-line">
          {textSegment}
        </span>
      );
    }
    
    // Markdown link label and url
    if (partIndex < parts.length) {
      const label = parts[partIndex++];
      const url = parts[partIndex++];
      
      const isRelative = url.startsWith('/');
      renderedElements.push(
        <Link
          key={`link-${partIndex}`}
          href={url}
          target={isRelative ? undefined : "_blank"}
          rel={isRelative ? undefined : "noopener noreferrer"}
          className="text-zinc-950 font-bold underline decoration-zinc-300 hover:decoration-zinc-900 transition-all"
        >
          {label}
        </Link>
      );
    }
  }

  return <p className="leading-loose">{renderedElements}</p>;
}
