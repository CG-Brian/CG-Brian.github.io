import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { collections, getEntry } from "@/lib/portfolio-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.research.entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getEntry("research", (await params).slug);
  return entry ? { title: entry.title, description: entry.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!getEntry("research", slug)) notFound();
  const { default: Content } = await import(`@/content/research/${slug}.mdx`);

  return (
    <CaseStudyPage collection="research" slug={slug}>
      <Content />
    </CaseStudyPage>
  );
}
