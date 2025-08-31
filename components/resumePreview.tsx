import Image from "next/image";
import resumePreview from "@/assets/resume-preview.png";
import { CheckCircle, Eye, FileText } from "lucide-react";

const ResumePreview = () => {
  return (
    <div className="relative animate-float">
      {/* Main Resume Preview */}
      <div className="relative rounded-2xl shadow-card overflow-hidden glass-morphism border border-white/20">
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          {/* Browser-like header */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2">Resume Preview</span>
          </div>
          
          {/* Status badges */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500 font-medium">HIRED!</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
              <Eye className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-blue-500 font-medium">Live Preview</span>
            </div>
          </div>
        </div>

        {/* Resume content */}
        <div className="pt-16">
          <Image
            src={resumePreview}
            alt="Resume Preview"
            className="w-full h-auto object-cover"
            width={500}
            height={500}
          />
        </div>

        {/* Bottom status indicators */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500 font-medium">ATS-Friendly</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30">
            <FileText className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-purple-500 font-medium">PDF Ready</span>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-primary animate-pulse opacity-60"></div>
      <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-gradient-primary/30 animate-pulse" style={{ animationDelay: "1s" }}></div>
    </div>
  );
};

export default ResumePreview;