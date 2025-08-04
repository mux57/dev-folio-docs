import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Menu, X, User, LogOut } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import AuthDialog from "@/components/AuthDialog";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import { useDownloadResume } from "@/hooks/useResumeLinks";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { downloadResume, isLoading: isResumeLoading } = useDownloadResume();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);



  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleNavigation = (item: { label: string; href: string }) => {
    // If we're not on the home page and clicking Home, or clicking any section link while not on home
    if (location.pathname !== '/' && (item.label === 'Home' || item.href.startsWith('#'))) {
      // Navigate to home page and then scroll to section
      navigate('/');
      // Use setTimeout to ensure page loads before scrolling
      setTimeout(() => {
        if (item.href.startsWith('#')) {
          const element = document.getElementById(item.href.substring(1));
          element?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (item.href.startsWith('#')) {
      // We're on home page, just scroll to section
      const element = document.getElementById(item.href.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Projects', href: '#projects' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-portfolio-lg border-b border-border' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              navigate('/');
            }}
            className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 hover:scale-105 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
            aria-label="Go to home page"
          >
            Portfolio
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher />

            <Button
              variant="download"
              size="sm"
              onClick={() => downloadResume()}
              disabled={isResumeLoading}
              className="group"
            >
              <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              {isResumeLoading ? 'Loading...' : 'Resume'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  className="text-left text-foreground hover:text-primary transition-colors duration-300 font-medium py-3 px-2 rounded-lg hover:bg-muted/50 min-h-[44px] flex items-center"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeSwitcher />
                </div>

                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="gap-2 justify-start min-h-[44px]"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAuthDialog(true)}
                    className="gap-2 justify-start min-h-[44px]"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                )}

                <Button
                  variant="download"
                  size="sm"
                  onClick={() => downloadResume()}
                  disabled={isResumeLoading}
                  className="group justify-start min-h-[44px]"
                >
                  <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {isResumeLoading ? 'Loading...' : 'Download Resume'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog} 
      />
    </header>
  );
};

export default Header;