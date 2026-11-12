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
  headline: "I build AI systems for real-world problems, from model internals to deployed applications.",
  background:
    "Computer Science & Biosciences at Rice University. Interested in how complex systems emerge from simpler interactions, and how that understanding connects to building reliable AI for the real world.",
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
    "Studying Computer Science and Biosciences at Rice taught me to think in systems: in biology, molecules interact to form pathways, networks and, ultimately, life. I’m fascinated by how complex behavior can emerge the same way inside artificial neural networks.",
    "That curiosity extends to how AI models learn, reason and interact, from a model’s internals to the systems built around it, and how understanding those interactions can shape better AI.",
    "Forward-deployed engineering gave it a practical direction: effective AI starts with understanding the problem, not just choosing the model. I want to do both, understanding how AI systems work and building applications that make a real difference.",
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
    focus: ["Conversational AI & Retrieval", "Diagnostic Algorithms & Backend Features", "Symptom-Aware Decision Tree Traversal (Prototype)"],
    title: "Industrial AI Troubleshooting Platform",
    category: "Forward-Deployed Engineering / AI Agents",
    description:
      "Engineered conversational AI and diagnostic backend features for an industrial troubleshooting platform, including grounded RAG, deterministic root-cause scoring, and automated service reports. Also proposed and prototyped symptom-aware decision tree traversal to reduce redundant diagnostic steps.",
    status: "Internship case study · Summer 2026",
    detail: {
      subtitle: "Engineering reliable AI agents and diagnostic workflows for industrial operations.",
      facts: [
        { label: "Context", value: "Forward-Deployed Engineering Internship · Summer 2026" },
        { label: "Areas", value: "Agentic AI · Backend Engineering · Retrieval · Diagnostic Algorithms" },
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
    focus: ["Spreadsheet Parsing & Header Inference", "LLM Normalization & Evaluation", "Field-Level Provenance & Data Contracts"],
    title: "Industrial AI Normalization Engine",
    category: "Forward-Deployed Engineering / Data & Applied AI",
    description:
      "Built a deterministic spreadsheet parser and automatic header inference for heterogeneous engineering documents. Improved LLM normalization reliability and developed field-level provenance contracts to produce structured, traceable engineering data.",
    status: "Internship case study · 2026",
    detail: {
      subtitle:
        "Building reliable, traceable AI pipelines for heterogeneous industrial engineering spreadsheets.",
      facts: [
        { label: "Context", value: "Forward-Deployed Engineering Internship · 2026" },
        { label: "Areas", value: "Data Engineering · Applied AI · Data Contracts · Traceability" },
        { label: "Stack", value: "Python · FastAPI · LLMs · Pydantic · ExcelJS · Structured outputs" },
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
    focus: ["Text-to-SQL & Semantic Modeling", "Cross-Domain Evidence Integration", "Deterministic Decision Logic"],
    title: "Telecom Operations Decision Agent",
    category: "Agentic AI / Analytics Engineering",
    description:
      "Built a Snowflake-based decision agent combining natural-language-to-SQL queries, cross-domain operational analysis, and deterministic prioritization. Used retrieved business evidence to generate explainable recommendations across marketing, sales, and customer operations.",
    status: "Korea Snowflake Hackathon 2026 · Prototype",
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
    slug: "multimodal-nla",
    focus: ["Multimodal Activation Interpretation", "Structured Concept Relationships", "Diffusion & Flow Models"],
    title: "Natural Language Autoencoders for Multimodal Interpretability",
    category: "Undergraduate Research / Multimodal AI / Mechanistic Interpretability",
    description:
      "Investigating how Natural Language Autoencoders can be adapted to interpret internal representations in multimodal generative models. Exploring whether structured descriptions of concepts and their relationships can help explain how models construct and refine generated images.",
    status: "Ongoing Research · Rice ChILi Lab",
    links: [
      { label: "Rice ChILi Lab", href: "https://hanjiechen.github.io/group.html" },
      { label: "Prof. Hanjie Chen", href: "https://profiles.rice.edu/faculty/hanjie-chen" },
      { label: "Anthropic NLA paper", href: "https://transformer-circuits.pub/2026/nla/" },
    ],
    detail: {
      subtitle: "Adapting Natural Language Autoencoders to multimodal generative models.",
      facts: [
        { label: "Affiliation", value: "Ongoing Undergraduate Research · Rice ChILi Lab" },
        { label: "Research context", value: "Professor Hanjie Chen, Rice University" },
        { label: "Status", value: "Early stage · Planning initial experiments · No results claimed" },
      ],
    },
  },
  {
    id: "R02",
    slug: "cirqloom",
    focus: ["Transformer Attention Measurement", "Evidence-Aware Circuit Visualization", "Reproducible Research Tooling"],
    title: "Cirqloom",
    category: "Mechanistic Interpretability / Research Engineering",
    description:
      "Built an interactive 3D explorer for GPT-2 Small’s 144 attention heads, with real attention measurements and published circuit annotations. Designed evidence-aware representations that keep observed patterns distinct from documented circuit relationships.",
    status: "Independent research · M3 in progress",
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
    id: "R03",
    slug: "stageground",
    focus: ["Controlled LLM Evaluation", "Evidence Grounding & Validation", "Abstention & Statistical Analysis"],
    title: "StageGround",
    category: "Clinical NLP / LLM Evaluation",
    description:
      "Designed and ran a 1,000-case clinical LLM evaluation investigating whether correct cancer-stage predictions are supported by source evidence. Compared prompting strategies, evidence requirements, and abstention behavior to identify gaps between label accuracy and grounded reliability.",
    status: "Independent research · Study complete",
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
