import type { EntryImages } from "./images";

/**
 * Single source of truth for portfolio content.
 * Add a project or research entry here, then add a matching MDX file in
 * content/projects/<slug>.mdx or content/research/<slug>.mdx.
 */

export type ExternalLink = {
  label: string;
  /** Leave null until the real URL is confirmed; it renders as pending, never as a broken link. */
  href: string | null;
};

export type Entry = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  /** Short qualifier shown in mono, e.g. "Exploratory". */
  status?: string;
  /** Key areas, restated from the description. Shown in the section index. */
  focus: string[];
  /** Public links (repository, demo, paper). Omit or leave href null until confirmed. */
  links?: ExternalLink[];
  /** Optional detail-page hero: a subtitle in place of the category, plus short labelled facts. */
  detail?: {
    subtitle: string;
    facts: { label: string; value: string }[];
  };
  /** Optional card and hero imagery. Only reference files that exist under /public. */
  images?: EntryImages;
};

export type Collection = "projects" | "research";

export const profile = {
  name: "Brian Jeong",
  greeting: "Hi, I’m Brian Jeong.",
  headline: "I build AI systems for real-world problems and explore how they work.",
  background:
    "Computer Science & Biosciences at Rice University, with experience in forward-deployed AI engineering and an interest in mechanistic interpretability.",
  links: [
    { label: "GitHub", href: "https://github.com/CG-Brian" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/chae-ghang-jeong-b73827298" },
    { label: "Email", href: "mailto:cj36@rice.edu" },
    { label: "Resume", href: null },
  ] satisfies ExternalLink[],
  /** Path under /public, e.g. "/portrait.jpg". Null shows a placeholder. */
  portrait: "/portrait.jpg" as string | null,
};

export const sections = [
  { id: "introduction", number: "01", label: "Introduction", short: "Intro" },
  { id: "foundations", number: "02", label: "Foundations", short: "Foundations" },
  { id: "projects", number: "03", label: "Projects", short: "Projects" },
  { id: "research", number: "04", label: "Research", short: "Research" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Natural-language introduction shown in the Foundations `self.init()` panel. */
export const identity = {
  heading: "Building systems. Understanding intelligence.",
  paragraphs: [
    "I’m a Computer Science and Biosciences student at Rice University, interested in building reliable AI systems for real-world problems.",
    "My experience in forward-deployed engineering has shaped how I approach software: understanding the problem first, then building systems that actually work.",
    "I’m also exploring mechanistic interpretability to better understand what’s happening inside the models I build with.",
  ],
};

export const skills = [
  {
    id: "software",
    number: "01",
    title: "Software Engineering",
    description: "Building reliable software, APIs, and data workflows.",
    items: ["Python", "C", "TypeScript", "FastAPI", "Docker", "SQL", "Git"],
  },
  {
    id: "ai",
    number: "02",
    title: "AI & ML Systems",
    description: "Designing, evaluating, and integrating LLM-based systems.",
    items: ["PyTorch", "Hugging Face", "RAG", "LangGraph", "FAISS", "Evaluation"],
  },
  {
    id: "foundations",
    number: "03",
    title: "Foundations & Research",
    description: "Understanding computational systems and studying model behavior.",
    items: ["Algorithms", "Linear Algebra", "Probability", "Transformers", "Interpretability"],
  },
] as const;

export type SkillId = (typeof skills)[number]["id"];

/**
 * Semantic tokenization of how I work. A metaphor, not the output of a real
 * tokenizer: each keyword maps to the skill node it leads into.
 */
export const tokens: { text: string; skill?: SkillId }[] = [
  { text: "build", skill: "software" },
  { text: "systems" },
  { text: "evaluate", skill: "ai" },
  { text: "models" },
  { text: "understand", skill: "foundations" },
  { text: "behavior" },
];

export const projects: Entry[] = [
  {
    id: "P01",
    slug: "industrial-ai-troubleshooting",
    focus: ["Agent orchestration & retrieval", "Deterministic diagnostic algorithms", "Evaluation, testing & CI"],
    title: "Industrial AI Troubleshooting Platform",
    category: "Forward-Deployed Engineering / AI Agents",
    description:
      "Built AI agent and backend capabilities for an industrial troubleshooting platform, combining retrieval-augmented generation, structured diagnostic workflows, and reliability-focused engineering.",
    status: "Internship case study · Summer 2026",
    detail: {
      subtitle: "Engineering reliable AI agents and guided diagnostic workflows for complex industrial operations.",
      facts: [
        { label: "Context", value: "Enterprise AI engineering internship · Summer 2026" },
        { label: "Areas", value: "Forward-Deployed Engineering · AI Agents · Backend Systems" },
        {
          label: "Stack",
          value: "Python · FastAPI · LangGraph · LangChain · Azure OpenAI · RAG · Pydantic · pytest · CI/CD",
        },
      ],
    },
    // Public photo (Unsplash, American Public Power Association). Generic field context, nothing from the engagement.
    images: {
      card: [
        {
          src: "/images/projects/industrial-ai-troubleshooting/field-card.webp",
          alt: "Wind turbines across grassy hills at sunset",
          position: "50% 45%",
        },
      ],
      hero: {
        src: "/images/projects/industrial-ai-troubleshooting/field-hero.webp",
        position: "60% 40%",
        opacity: 0.24,
      },
    },
  },
  {
    id: "P02",
    slug: "industrial-ai-normalization",
    focus: ["Deterministic parsing + LLM normalization", "Entity-once normalization", "Provenance & validation"],
    title: "Industrial AI Normalization Engine",
    category: "Forward-Deployed Engineering / Applied AI",
    description:
      "Building a reliable hybrid AI pipeline to transform complex industrial engineering spreadsheets into structured, consistent, and traceable data.",
    status: "Internship case study",
    detail: {
      subtitle:
        "Engineering reliable, traceable data transformations with deterministic parsing and LLM-assisted normalization.",
      facts: [
        { label: "Context", value: "Enterprise AI engineering · Forward-deployed internship" },
        { label: "Areas", value: "Forward-Deployed Engineering · Applied AI · Enterprise Data Workflows" },
        { label: "Stack", value: "Python · FastAPI · LLMs · Pydantic · Structured extraction" },
      ],
    },
    // Generic cause-and-effect matrix template. Public illustration, not a customer spreadsheet.
    images: {
      card: [
        {
          src: "/images/projects/industrial-ai-normalization/matrix-card.webp",
          alt: "Generic cause-and-effect matrix template relating process input variables to weighted outputs",
          fit: "contain",
        },
      ],
      hero: {
        src: "/images/projects/industrial-ai-normalization/matrix-hero.webp",
        position: "40% 55%",
        opacity: 0.13,
      },
    },
  },
  {
    id: "P03",
    slug: "telecom-ops-agent",
    focus: ["Text-to-SQL on a semantic layer", "Multi-domain decision logic", "Evidence before explanation"],
    title: "Telecom Operations Decision Agent",
    category: "Engineering / Agentic AI / Data Analytics",
    description:
      "Built a Snowflake-powered AI decision agent that integrates marketing, sales, conversion funnel, and customer-service data to identify bottlenecks, evaluate competing business priorities, and generate actionable recommendations.",
    status: "Korea Snowflake Hackathon 2026",
    links: [{ label: "View repository", href: "https://github.com/CG-Brian/telecom-ops-agent" }],
    detail: {
      subtitle: "From fragmented operational data to evidence-grounded business decisions.",
      facts: [
        { label: "Context", value: "Korea Snowflake Hackathon 2026 · April 2026 · Prototype, not a deployed product" },
        { label: "Areas", value: "Applied AI · Data Engineering · Agentic AI" },
        {
          label: "Stack",
          value: "Python · Cortex Analyst · Cortex Complete · Snowpark · SQL · Semantic Views · Streamlit · Pandas",
        },
      ],
    },
    images: {
      card: [
        {
          src: "/images/projects/telecom-ops-agent/agent-card.webp",
          alt: "Telecom operations agent in Streamlit: Korean-language example questions beside an integrated conclusion, action items and priorities",
          position: "50% 20%",
        },
      ],
      hero: {
        src: "/images/projects/telecom-ops-agent/agent-hero.webp",
        position: "60% 30%",
        opacity: 0.12,
      },
    },
  },
];

export const research: Entry[] = [
  {
    id: "R01",
    slug: "cirqloom",
    focus: ["Measured attention vs. published circuits", "Evidence-preserving circuit graphs", "Reproducible research bundles"],
    title: "Cirqloom",
    category: "Independent Research / Mechanistic Interpretability / Research Engineering",
    description:
      "Built an interactive 3D research tool for exploring GPT-2 Small's attention heads, inspecting measured attention patterns, and visualizing published circuit relationships with explicit evidence provenance.",
    status: "Independent project · M3 in progress",
    links: [{ label: "View repository", href: "https://github.com/CG-Brian/cirqloom" }],
    detail: {
      subtitle: "An evidence-aware, interactive atlas of transformer attention heads and circuits.",
      facts: [
        { label: "Context", value: "Independent research engineering · GPT-2 Small, 12 × 12 heads · M3 in progress" },
        { label: "Areas", value: "Independent Research · Mechanistic Interpretability · GPT-2 Small" },
        {
          label: "Stack",
          value:
            "Python · PyTorch · TransformerLens · NumPy · Pydantic · React · TypeScript · React Three Fiber · Three.js · Zustand · Zod · pytest · Playwright",
        },
      ],
    },
    images: {
      card: [
        {
          src: "/images/research/cirqloom/explorer-card.webp",
          alt: "Cirqloom explorer: GPT-2 Small layers in 3D with the published IOI circuit, beside the circuit sidebar and head inspector",
          position: "50% 45%",
        },
      ],
      hero: {
        src: "/images/research/cirqloom/explorer-hero.webp",
        position: "45% 50%",
        opacity: 0.12,
      },
    },
  },
  {
    id: "R02",
    slug: "stageground",
    focus: ["Label accuracy vs. source grounding", "Controlled prompting ablation", "Abstention & evidence binding"],
    title: "StageGround",
    category: "Independent Research / Clinical AI / LLM Evaluation",
    description:
      "Investigating whether correct clinical LLM predictions are genuinely supported by source documents through controlled prompting ablations, evidence-grounding evaluation, and abstention analysis.",
    status: "Independent study · Experiments complete",
    links: [
      { label: "View research repository", href: "https://github.com/CG-Brian/stage-ground" },
      { label: "Explore interactive results", href: "https://web-plum-one-77.vercel.app" },
    ],
    detail: {
      subtitle: "When a clinical LLM is correct, is it actually grounded in the source?",
      facts: [
        { label: "Context", value: "Independent research · Not peer-reviewed · Not for clinical use" },
        { label: "Areas", value: "Independent Research · Clinical NLP · LLM Evaluation" },
        {
          label: "Stack",
          value: "Python · GPT-4o · Pydantic · Pandas · Statistical analysis · FastAPI · Next.js",
        },
      ],
    },
    images: {
      card: [
        {
          src: "/images/research/stageground/sandbox-card.webp",
          alt: "StageGround evaluation sandbox replaying a TNM prediction across prompting strategies",
          position: "50% 0%",
        },
      ],
      hero: {
        src: "/images/research/stageground/sandbox-hero.webp",
        position: "50% 90%",
        opacity: 0.2,
      },
    },
  },
];

export const collections: Record<Collection, { label: string; number: string; entries: Entry[] }> = {
  projects: { label: "Projects", number: "03", entries: projects },
  research: { label: "Research", number: "04", entries: research },
};

export function getEntry(collection: Collection, slug: string) {
  return collections[collection].entries.find((e) => e.slug === slug);
}
