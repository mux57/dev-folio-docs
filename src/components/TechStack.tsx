import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TechStack = () => {
  const technologies = {
    backend: [
      "Java", "Spring Boot", "TypeScript", "JavaScript"
    ],
    databases: [
      "MongoDB", "MySQL", "Redis", "Elasticsearch"
    ],
    cloud: [
      "AWS", "Docker", "Kubernetes", "Kafka", "GitHub", "Linux"
    ],
    design: [
      "System Design", "Distributed Systems", "Low Level Design", "Scalability"
    ],
    ai: [
      "Prompt Engineering", "Agentic AI Coding"
    ],
    leadership: [
      "Mentoring", "Tech Sessions"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">Backend & Languages</CardTitle>
              <CardDescription>Core Development Technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.backend?.map((tech) => (
                  <Badge key={tech} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tech}
                  </Badge>
                )) || []}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">Databases & Storage</CardTitle>
              <CardDescription>Data Management & Search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.databases.map((tech) => (
                  <Badge key={tech} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">Cloud & DevOps</CardTitle>
              <CardDescription>Infrastructure & Deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.cloud.map((tech) => (
                  <Badge key={tech} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">System Design & Architecture</CardTitle>
              <CardDescription>Scalable System Design</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.design.map((tech) => (
                  <Badge key={tech} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">AI & Modern Development</CardTitle>
              <CardDescription>AI-Powered Development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.ai.map((tech) => (
                  <Badge key={tech} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-primary">Leadership & Mentoring</CardTitle>
              <CardDescription>Team Development & Knowledge Sharing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.leadership.map((tech) => (
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