# 🚀 Modern Portfolio Website

A beautiful, responsive portfolio website built with React, TypeScript, and Supabase. Features include blog functionality, Google OAuth authentication, contact forms, and more.

## ✨ **Features**

- 🎨 **Modern Design** - Clean, responsive UI with dark/light themes
- 📝 **Blog System** - Create, edit, and manage blog posts
- 🔐 **Google OAuth** - Secure authentication with Supabase
- 📧 **Contact Form** - EmailJS integration for contact messages
- 🛡️ **Bot Protection** - Smart contact information protection
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🚀 **Fast Performance** - Optimized builds and lazy loading
- 🌙 **Theme Support** - Multiple color themes available

## 🛠️ **Tech Stack**

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Radix UI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth + Google OAuth
- **Email:** EmailJS
- **Deployment:** GitHub Pages
- **Icons:** Lucide React

## 🚀 **Quick Start**

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/your-portfolio.git
cd your-portfolio
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

### **3. Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:8080` to see your portfolio!

## 📚 **Documentation**

### **Setup Guides**
- 🔐 [**Supabase + Google Auth Setup**](./docs/SUPABASE_GOOGLE_AUTH_SETUP.md) - Complete OAuth configuration
- 📧 [**EmailJS Setup**](./docs/EMAILJS_SETUP.md) - Contact form configuration
- ⚙️ [**Environment Variables**](./docs/ENVIRONMENT_SETUP.md) - All required variables
- 🚀 [**Deployment Guide**](./docs/DEPLOYMENT.md) - Deploy to GitHub Pages

### **Quick Links**
- [Live Demo](https://yourusername.github.io/your-portfolio/)
- [Issues](https://github.com/yourusername/your-portfolio/issues)

## 🔧 **Environment Variables**

Required environment variables (see [Environment Setup](./docs/ENVIRONMENT_SETUP.md) for details):

```env
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADMIN_EMAIL=your-admin-email

# EmailJS
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key

# Contact Info
VITE_CONTACT_EMAIL=your-email
VITE_CONTACT_PHONE=your-phone
VITE_GITHUB_USERNAME=your-github
VITE_LINKEDIN_USERNAME=your-linkedin
```

## 🚀 **Deployment**

### **GitHub Pages (Recommended)**
1. **Enable GitHub Pages** in repository settings
2. **Add all required secrets** (see [Deployment Guide](./docs/DEPLOYMENT.md))
3. **Push to main branch** to trigger deployment

### **Other Platforms**
- **Vercel:** Connect GitHub repo and add environment variables
- **Netlify:** Connect GitHub repo and configure build settings
- **Railway:** Deploy from GitHub with environment variables

## 📱 **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database (Optional - for local SQLite)
npm run sqlite:install  # Install SQLite server dependencies
npm run sqlite:server   # Start local SQLite server
npm run dev:full       # Start both SQLite server and dev server
```

## 🎨 **Customization**

### **Themes**
- Multiple color themes available in the UI
- Themes are stored in localStorage
- Easy to add new themes in `src/contexts/ThemeContext.tsx`

### **Content**
- Update personal information in environment variables
- Modify sections in `src/components/`
- Add new pages by creating routes in `src/App.tsx`

### **Styling**
- Tailwind CSS for utility-first styling
- Radix UI for accessible components
- Custom CSS variables for theming

## 🔒 **Security Features**

- **Environment Variables** - Sensitive data stored securely
- **Bot Protection** - Contact information protected from scrapers
- **RLS Policies** - Database-level security with Supabase
- **OAuth Authentication** - Secure Google sign-in
- **Input Validation** - Form validation and sanitization

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- 📖 **Documentation:** Check the [docs](./docs/) folder
- 🐛 **Issues:** Report bugs in [GitHub Issues](https://github.com/yourusername/your-portfolio/issues)
- 💬 **Discussions:** Join [GitHub Discussions](https://github.com/yourusername/your-portfolio/discussions)

## 🙏 **Acknowledgments**

- [React](https://reactjs.org/) - UI library
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [EmailJS](https://www.emailjs.com/) - Email service
- [Lucide](https://lucide.dev/) - Icon library

---

**⭐ Star this repository if you found it helpful!**
