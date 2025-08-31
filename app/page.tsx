import Navigation from "@/components/navigation";
import HeroSection from "@/components/heroSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
      </main>
    </div>
  );
};

export default Index;