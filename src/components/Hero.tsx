import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { useDownloadResume } from "@/hooks/useResumeLinks";

const Hero = () => {
  const { downloadResume, isLoading } = useDownloadResume();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,theme(colors.primary.DEFAULT/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,theme(colors.accent.DEFAULT/0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Staff Engineer @Tekion.Corp
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-foreground">
            Software Engineer
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Passionate about backend development, distributed systems, architecture, and scalability.
            Specializing in Java, Spring Boot, and building high-performance distributed solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => scrollToSection('projects')}
              className="group"
            >
              View My Work
              <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button
              variant="download"
              size="xl"
              onClick={() => downloadResume()}
              disabled={isLoading}
              className="group"
            >
              <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {isLoading ? 'Loading...' : 'Download Resume'}
            </Button>
          </div>

          <div className="flex justify-center space-x-6">
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary"
              onClick={() => window.open('https://github.com/mux57', '_blank')}
            >
              <Github className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary"
              onClick={() => window.open('https://www.linkedin.com/in/mukeshknit57/', '_blank')}
            >
              <Linkedin className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary"
              onClick={() => window.open('mailto:mukeshknit57@gmail.com', '_blank')}
            >
              <Mail className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  );
};

export default Hero;