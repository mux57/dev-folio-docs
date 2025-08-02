import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, FileText, Globe } from "lucide-react";
import { downloadSitemap, downloadRobotsTxt } from "@/utils/sitemap";
import { useToast } from "@/hooks/use-toast";

const SEOTools = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownloadSitemap = async () => {
    setIsGenerating(true);
    try {
      const success = await downloadSitemap();
      if (success) {
        toast({
          title: "Sitemap Generated! 🗺️",
          description: "sitemap.xml has been downloaded successfully.",
        });
      } else {
        throw new Error("Failed to generate sitemap");
      }
    } catch (error) {
      console.error("Sitemap generation error:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating the sitemap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadRobots = () => {
    try {
      const success = downloadRobotsTxt();
      if (success) {
        toast({
          title: "Robots.txt Generated! 🤖",
          description: "robots.txt has been downloaded successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating robots.txt.",
        variant: "destructive",
      });
    }
  };

  const seoTools = [
    {
      title: "XML Sitemap",
      description: "Generate sitemap.xml for search engines",
      icon: Globe,
      action: handleDownloadSitemap,
      loading: isGenerating,
      buttonText: isGenerating ? "Generating..." : "Download Sitemap"
    },
    {
      title: "Robots.txt",
      description: "Generate robots.txt for crawler instructions",
      icon: FileText,
      action: handleDownloadRobots,
      loading: false,
      buttonText: "Download Robots.txt"
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-background/95 backdrop-blur-md border-border shadow-portfolio-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            SEO Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {seoTools.map((tool, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <tool.icon className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-sm">{tool.title}</p>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </div>
              <Button
                onClick={tool.action}
                size="sm"
                variant="outline"
                disabled={tool.loading}
                className="ml-2"
              >
                <Download className="h-3 w-3 mr-1" />
                {tool.buttonText}
              </Button>
            </div>
          ))}
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              SEO optimization tools for better search visibility
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOTools;
