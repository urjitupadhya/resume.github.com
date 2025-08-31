import { Zap, Shield, Eye, Download } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Unlimited free scanning",
    color: "text-purple-500"
  },
  {
    icon: Shield,
    title: "ATS-optimized",
    color: "text-blue-500"
  },
  {
    icon: Eye,
    title: "Live preview",
    color: "text-green-500"
  },
  {
    icon: Download,
    title: "PDF export",
    color: "text-orange-500"
  }
];

const FeatureBadges = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl glass-morphism border border-white/10 animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`p-2 rounded-lg bg-card ${feature.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {feature.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureBadges;