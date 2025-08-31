import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";
import FeatureBadges from "./featureBadges";
// import TrustIndicators from "./trustIndicators";
import ResumePreview from "./resumePreview";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen hero-gradient overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-12">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Trust badge */}
            <div className="flex items-center gap-2 animate-fade-up">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Trusted by Working professionals</span>
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <span className="gradient-text">AI-powered</span>
                <br />
                <span className="text-foreground">Resume Builder</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg animate-fade-up" style={{ animationDelay: "0.2s" }}>
                Create professional, ATS-friendly resumes that get you noticed. <span className="gradient-text font-semibold">Stand out from the crowd</span> with our expertly designed templates.
              </p>
            </div>

            {/* Feature badges */}
            <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <FeatureBadges />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <Button size="lg" className="group">
                Start Building Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                <Target className="w-4 h-4 mr-2" />
                Get ATS Score
              </Button>
            </div>

            {/* Trust indicators */}
            {/* <TrustIndicators /> */}
          </div>

          {/* Right Column - Resume Preview */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;