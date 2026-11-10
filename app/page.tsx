import { HorizontalSections } from "@/components/layout/HorizontalSections";
import { FoundationsSection } from "@/components/sections/FoundationsSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ResearchSection } from "@/components/sections/ResearchSection";

export default function Home() {
  return (
    <HorizontalSections>
      <IntroSection />
      <FoundationsSection />
      <ProjectsSection />
      <ResearchSection />
    </HorizontalSections>
  );
}
