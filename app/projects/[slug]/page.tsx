import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study/CaseStudyPage";
import { collections, getEntry } from "@/lib/portfolio-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.projects.entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getEntry("projects", (await params).slug);
  return entry ? { title: entry.title, description: entry.description } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!getEntry("projects", slug)) notFound();
  const { default: Content } = await import(`@/content/projects/${slug}.mdx`);

  return (
    <CaseStudyPage collection="projects" slug={slug}>
      <Content />
    </CaseStudyPage>
  );
}
