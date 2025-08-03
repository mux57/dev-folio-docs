import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Github, Linkedin, Phone, Send, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';
import ProtectedContact from "@/components/ProtectedContact";
import ContactProtectionWrapper from "@/components/ContactProtectionWrapper";
import { useEffect } from "react";

const Contact = () => {
  const { toast } = useToast();

  // Add contact protection meta tags when component mounts
  useEffect(() => {
    // Add specific meta tags to prevent contact section crawling
    const addContactProtectionMeta = () => {
      // Remove existing contact protection meta if any
      const existingMeta = document.querySelector('meta[name="contact-section"]');
      if (existingMeta) existingMeta.remove();

      // Add new protection meta
      const meta = document.createElement('meta');
      meta.name = 'contact-section';
      meta.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
      document.head.appendChild(meta);

      // Add robots meta specifically for this section
      const robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
      robotsMeta.setAttribute('data-contact-protection', 'true');
      document.head.appendChild(robotsMeta);
    };

    addContactProtectionMeta();

    return () => {
      // Cleanup on unmount
      const contactMeta = document.querySelector('meta[name="contact-section"]');
      const robotsMeta = document.querySelector('meta[data-contact-protection="true"]');
      if (contactMeta) contactMeta.remove();
      if (robotsMeta) robotsMeta.remove();
    };
  }, []);

  // Optimized initial state
  const initialFormState = {
    name: "",
    email: "",
    subject: "",
    company: "",
    message: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, Message).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // EmailJS config
      const config = {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      };

      if (!config.serviceId || !config.templateId || !config.publicKey) {
        throw new Error("EmailJS configuration missing");
      }

      // Template params (optimized)
      const params = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        subject: formData.subject || "Portfolio Contact",
        company: formData.company || "",
        reply_to: formData.email,
      };

      // Send email using EmailJS
      await emailjs.send(config.serviceId, config.templateId, params, config.publicKey);

      toast({
        title: "Message Sent Successfully! 🎉",
        description: "Thank you for reaching out! I'll get back to you within 24-48 hours.",
      });

      // Reset form
      setFormData({ name: "", email: "", subject: "", company: "", message: "" });

    } catch (error: any) {
      console.error("EmailJS Error Details:", {
        error,
        message: error?.message,
        status: error?.status,
        text: error?.text
      });

      const errorMessage = error?.text || error?.message || "Unknown error occurred";

      toast({
        title: "Failed to Send Message",
        description: `Error: ${errorMessage}. Please try again or contact me directly at mukeshknit57@gmail.com`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "mukeshknit57@gmail.com",
      href: "mailto:mukeshknit57@gmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 7411729430",
      href: "tel:+917411729430"
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/mux57",
      href: "https://github.com/mux57"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/mukeshknit57",
      href: "https://www.linkedin.com/in/mukeshknit57/"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Bengaluru, India",
      href: null
    }
  ];

  return (
    <ContactProtectionWrapper>
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Get In Touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Let's connect and build something amazing together!
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">Let's Connect</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always interested in hearing about new opportunities, interesting projects, 
                or just having a chat about technology and development. Feel free to reach out!
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info) => {
                // Use protected component for sensitive contact info
                if (info.label === "Email" || info.label === "Phone") {
                  return (
                    <ProtectedContact
                      key={info.label}
                      type={info.label === "Email" ? "email" : "phone"}
                      value={info.value}
                      label={info.label}
                      icon={info.icon}
                      href={info.href}
                      className="w-full"
                    />
                  );
                }

                // Regular display for non-sensitive info
                return (
                  <div key={info.label} className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-card rounded-lg flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          rel="nofollow noopener"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-8">
              <h4 className="text-lg font-semibold mb-4 text-foreground">Available For</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Full-time opportunities</li>
                <li>• Freelance projects</li>
                <li>• Consulting & code reviews</li>
                <li>• Speaking engagements</li>
                <li>• Open source collaboration</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-portfolio-lg">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-background border-border"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-background border-border"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-foreground mb-2 block">
                    Subject <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="text-sm font-medium text-foreground mb-2 block">
                    Company <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Your company or organization"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project or just say hello!"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="bg-background border-border resize-none h-32"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full group"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
    </ContactProtectionWrapper>
  );
};

export default Contact;