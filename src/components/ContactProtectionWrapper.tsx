import { useEffect, ReactNode } from 'react';

interface ContactProtectionWrapperProps {
  children: ReactNode;
}

const ContactProtectionWrapper = ({ children }: ContactProtectionWrapperProps) => {
  useEffect(() => {
    // Add multiple layers of protection when contact section is rendered
    const addProtectionAttributes = () => {
      // Find the contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        // Add data attributes to prevent crawling
        contactSection.setAttribute('data-nosnippet', 'true');
        contactSection.setAttribute('data-noindex', 'true');
        contactSection.setAttribute('data-private', 'true');
        contactSection.setAttribute('aria-hidden', 'true');
        
        // Add CSS class for additional protection
        contactSection.classList.add('contact-protected');
        
        // Add invisible text for bots
        const botWarning = document.createElement('div');
        botWarning.style.display = 'none';
        botWarning.setAttribute('data-bot-warning', 'true');
        botWarning.textContent = 'This section contains private contact information and should not be indexed or cached by search engines or bots.';
        contactSection.appendChild(botWarning);
      }
    };

    // Add protection after a small delay to ensure DOM is ready
    const timer = setTimeout(addProtectionAttributes, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup protection attributes
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const botWarning = contactSection.querySelector('[data-bot-warning="true"]');
        if (botWarning) {
          contactSection.removeChild(botWarning);
        }
      }
    };
  }, []);

  return (
    <div 
      data-contact-protection="enabled"
      data-noindex="true"
      data-nofollow="true"
      data-noarchive="true"
      data-nosnippet="true"
      style={{ 
        // Additional CSS protection
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};

export default ContactProtectionWrapper;
