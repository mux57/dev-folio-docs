import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.",
      image: "/api/placeholder/400/250",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      githubUrl: "https://github.com/username/ecommerce",
      liveUrl: "https://ecommerce-demo.com",
      featured: true
    },
    {
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates, team collaboration features, and advanced filtering.",
      image: "/api/placeholder/400/250",
      technologies: ["Vue.js", "Express.js", "MongoDB", "Socket.io"],
      githubUrl: "https://github.com/username/task-app",
      liveUrl: "https://taskmanager-demo.com",
      featured: true
    },
    {
      title: "Weather Dashboard",
      description: "Real-time weather dashboard with location-based forecasts, interactive maps, and historical data visualization.",
      image: "/api/placeholder/400/250",
      technologies: ["React", "TypeScript", "Chart.js", "OpenWeather API"],
      githubUrl: "https://github.com/username/weather-app",
      liveUrl: "https://weather-dashboard-demo.com",
      featured: false
    },
    {
      title: "Social Media Analytics",
      description: "Analytics platform for social media performance tracking with data visualization and automated reporting.",
      image: "/api/placeholder/400/250",
      technologies: ["Next.js", "Python", "FastAPI", "D3.js", "Redis"],
      githubUrl: "https://github.com/username/social-analytics",
      liveUrl: "https://analytics-demo.com",
      featured: false
    }
  ];

  return (
    <section id="projects" className="py-20 bg-project-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of projects showcasing my skills and experience in full-stack development
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {projects.filter(project => project.featured).map((project, index) => (
            <Card key={index} className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-500 hover:shadow-portfolio-lg group overflow-hidden">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="text-6xl font-bold text-primary/20">{project.title.split(' ').map(w => w[0]).join('')}</div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-primary/20 text-primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="group/btn">
                    <Github className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    Code
                  </Button>
                  <Button variant="default" size="sm" className="group/btn">
                    <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    Live Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.filter(project => !project.featured).map((project, index) => (
            <Card key={index} className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg group">
              <CardHeader>
                <CardTitle className="text-foreground group-hover:text-primary transition-colors text-lg">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="border-primary/20 text-primary text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="border-primary/20 text-primary text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="group">
            View All Projects
            <ExternalLink className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;