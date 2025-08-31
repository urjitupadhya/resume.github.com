import { Star } from "lucide-react";
import userAvatars from "@/assets/user-avatars.png";
import Image from "next/image";

const TrustIndicators = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-up" style={{ animationDelay: "0.6s" }}>
      {/* User Avatars */}
      <div className="flex -space-x-2">
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
          <Image
            src={userAvatars}
            alt="User 1"
            className="w-full h-full object-cover object-[0%_50%]"
            width={50}
            height={50}
          />
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
          <Image
            src={userAvatars}
            alt="User 2"
            className="w-full h-full object-cover object-[25%_50%]"
            width={50}
            height={50}
          />
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
          <Image
            src={userAvatars}
            alt="User 3"
            className="w-full h-full object-cover object-[50%_50%]"
            width={50}
            height={50}
          />
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
          <Image
            src={userAvatars}
            alt="User 4"
            className="w-full h-full object-cover object-[75%_50%]"
            width={50}
            height={50}
          />
        </div>
      </div>

      {/* Rating and Text */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Trusted by Employees from <span className="font-semibold text-foreground">EY, Blackstone, Deloitte, Growth School</span>
        </p>
      </div>
    </div>
  );
};

export default TrustIndicators;