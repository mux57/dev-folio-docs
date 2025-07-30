import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TechStack = () => {
  const technologies = {
    frontend: [
      "React", "TypeScript", "Next.js", "Tailwind CSS", "Vue.js", "JavaScript"
    ],
    backend: [
      "Node.js", "Python", "Express.js", "Django", "PostgreSQL", "MongoDB"
    ],
    tools: [
      "Docker", "AWS", "Git", "Linux", "Kubernetes", "Redis"
    ],
    languages: [
      "JavaScript", "TypeScript", "Python", "Java", "Go", "SQL"
    ]
  };

  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Tech Stack</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with to build amazing applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">Frontend</CardTitle>
              <CardDescription>Modern UI/UX Technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.frontend.map((tech) => (
                  <Badge key={tech} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">Backend</CardTitle>
              <CardDescription>Server & Database Technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.backend.map((tech) => (
                  <Badge key={tech} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">Tools & Cloud</CardTitle>
              <CardDescription>DevOps & Infrastructure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.tools.map((tech) => (
                  <Badge key={tech} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">Languages</CardTitle>
              <CardDescription>Programming Languages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.languages.map((tech) => (
                  <Badge key={tech} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TechStack;