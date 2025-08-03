import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

const Education = () => {
  const education = [
    {
      degree: "M.Tech in Computer Science",
      institution: "National Institute of Technology, Surathkal",
      year: "2016",
      location: "Karnataka, India",
      type: "Master's Degree",
      description: "Advanced studies in Computer Science with focus on algorithms, system design, and software engineering principles."
    },
    {
      degree: "B.Tech in Computer Science",
      institution: "Kamala Nehru Institute of Technology, Sultanpur",
      year: "2013",
      location: "Uttar Pradesh, India", 
      type: "Bachelor's Degree",
      description: "Foundation in Computer Science covering programming, data structures, computer networks, and software development."
    }
  ];

  return (
    <section id="education" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Education</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Academic foundation in Computer Science from premier institutions
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((edu, index) => (
            <Card key={index} className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">{edu.degree}</CardTitle>
                      <CardDescription className="text-lg font-medium text-primary">
                        {edu.institution}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {edu.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Graduated {edu.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {edu.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Academic Achievements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-card border border-border rounded-lg px-6 py-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Academic Excellence</h3>
              <p className="text-sm text-muted-foreground">
                Strong foundation from NIT Surathkal, one of India's premier technical institutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
