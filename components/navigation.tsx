"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { UserProfile } from "./user-profile";
import { useAuth } from "./auth-provider";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold gradient-text">
              TalentElse
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="/#"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Home
              </a>
              <Link
                href="/builder"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Builder
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
              )}
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Templates
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                ATS Score
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                About
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
                <UserProfile />
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Button size="sm">
                  Start Building
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 glass-morphism border-t border-white/10">
            <a
              href="#"
              className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Builder
            </a>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Dashboard
              </Link>
            )}
            <a
              href="#"
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Templates
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              ATS Score
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              Contact
            </a>
            <div className="px-3 py-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full">
                      Profile
                    </Button>
                  </Link>
                  <div className="flex justify-center">
                    <UserProfile />
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Button size="sm" className="w-full">
                    Start Building
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;