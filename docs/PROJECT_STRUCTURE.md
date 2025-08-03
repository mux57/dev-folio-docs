# 📁 Project Structure

Overview of the portfolio website's file organization and architecture.

## 🏗️ **Root Directory**

```
dev-folio-docs/
├── 📁 .github/workflows/     # GitHub Actions for deployment
├── 📁 docs/                  # Documentation files
├── 📁 public/                # Static assets
├── 📁 src/                   # Source code
├── 📁 supabase/              # Database migrations (gitignored)
├── 📄 .env.example           # Environment variables template
├── 📄 .gitignore             # Git ignore rules
├── 📄 package.json           # Dependencies and scripts
├── 📄 README.md              # Main documentation
├── 📄 tailwind.config.ts     # Tailwind CSS configuration
├── 📄 tsconfig.json          # TypeScript configuration
└── 📄 vite.config.ts         # Vite build configuration
```

## 📂 **Source Code Structure**

```
src/
├── 📁 components/            # React components
│   ├── 📁 ui/               # Reusable UI components (Radix UI)
│   ├── 📄 Contact.tsx       # Contact form with EmailJS
│   ├── 📄 Hero.tsx          # Landing page hero section
│   ├── 📄 Navigation.tsx    # Main navigation component
│   ├── 📄 Projects.tsx      # Projects showcase
│   ├── 📄 Skills.tsx        # Skills and technologies
│   └── 📄 ...               # Other page components
├── 📁 contexts/             # React contexts
│   └── 📄 ThemeContext.tsx  # Theme management
├── 📁 database/             # Database clients
│   ├── 📄 sqlite-client.ts  # Local SQLite client
│   └── 📄 sqlite-schema.sql # Database schema
├── 📁 hooks/                # Custom React hooks
│   ├── 📄 useAuth.ts        # Authentication hook
│   └── 📄 use-toast.ts      # Toast notifications
├── 📁 integrations/         # External service integrations
│   └── 📁 supabase/         # Supabase configuration
├── 📁 lib/                  # Utility libraries
│   ├── 📄 supabase.ts       # Supabase client
│   └── 📄 utils.ts          # Helper functions
├── 📁 pages/                # Page components
│   ├── 📄 Index.tsx         # Home page
│   ├── 📄 BlogList.tsx      # Blog listing page
│   ├── 📄 BlogPost.tsx      # Individual blog post
│   └── 📄 AdminDashboard.tsx # Admin panel
├── 📁 utils/                # Utility functions
│   └── 📄 databaseVerification.ts # Database testing
├── 📄 App.tsx               # Main app component
├── 📄 index.css             # Global styles
└── 📄 main.tsx              # App entry point
```

## 🎨 **Component Architecture**

### **Page Components**
- **Index.tsx** - Main landing page with all sections
- **BlogList.tsx** - Blog posts listing with pagination
- **BlogPost.tsx** - Individual blog post view
- **AdminDashboard.tsx** - Admin panel for content management

### **Section Components**
- **Hero.tsx** - Landing page hero with introduction
- **About.tsx** - About section with personal info
- **Skills.tsx** - Technical skills showcase
- **Projects.tsx** - Portfolio projects display
- **Contact.tsx** - Contact form with EmailJS integration
- **Navigation.tsx** - Main navigation with theme switcher

### **UI Components** (Radix UI based)
- **Button, Input, Textarea** - Form elements
- **Card, Dialog, Dropdown** - Layout components
- **Toast, Tabs, Accordion** - Interactive elements
- **Avatar, Badge, Progress** - Display components

## 🔧 **Configuration Files**

### **Build & Development**
- **vite.config.ts** - Vite configuration with GitHub Pages base path
- **tsconfig.json** - TypeScript compiler options
- **eslint.config.js** - Code linting rules
- **tailwind.config.ts** - Tailwind CSS customization

### **Package Management**
- **package.json** - Dependencies, scripts, and metadata
- **package-lock.json** - Exact dependency versions

### **Environment**
- **.env.example** - Environment variables template
- **.env** - Local environment variables (gitignored)

## 🗄️ **Database Structure**

### **Supabase Tables**
- **blog_posts** - Blog content and metadata
- **blog_likes** - User likes for blog posts
- **user_preferences** - User settings and themes
- **resume_links** - Resume download links

### **Authentication**
- **Supabase Auth** - Google OAuth integration
- **Row Level Security** - Database access control
- **User sessions** - Persistent authentication

## 🚀 **Deployment Structure**

### **GitHub Actions**
- **.github/workflows/deploy.yml** - Automated deployment
- **Environment secrets** - Secure variable storage
- **Build artifacts** - Compiled static files

### **Static Assets**
- **public/** - Images, icons, and static files
- **dist/** - Built files for deployment (generated)

## 🔒 **Security Architecture**

### **Environment Variables**
- **Development** - Local .env file
- **Production** - GitHub Secrets
- **Validation** - Runtime environment checks

### **Authentication Flow**
1. **Google OAuth** - User authentication
2. **Supabase Session** - Session management
3. **Admin Check** - Email-based authorization
4. **Protected Routes** - Admin-only access

### **Data Protection**
- **RLS Policies** - Database-level security
- **Bot Protection** - Contact info obfuscation
- **Input Validation** - Form sanitization

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile** - < 768px
- **Tablet** - 768px - 1024px
- **Desktop** - > 1024px

### **Layout Strategy**
- **Mobile-first** - Progressive enhancement
- **Flexbox/Grid** - Modern CSS layouts
- **Tailwind Classes** - Responsive utilities

## 🎨 **Theming System**

### **Theme Structure**
- **CSS Variables** - Dynamic color values
- **Theme Context** - React state management
- **Local Storage** - Theme persistence
- **Multiple Themes** - Ocean, Forest, Sunset, etc.

### **Color System**
- **Primary** - Brand colors
- **Secondary** - Accent colors
- **Neutral** - Text and backgrounds
- **Semantic** - Success, error, warning

## 📊 **Performance Optimizations**

### **Code Splitting**
- **Lazy Loading** - Route-based splitting
- **Dynamic Imports** - Component-level splitting
- **Vendor Chunks** - Library separation

### **Asset Optimization**
- **Image Optimization** - WebP format support
- **Bundle Analysis** - Size monitoring
- **Tree Shaking** - Unused code removal

## 🔗 **Integration Points**

### **External Services**
- **Supabase** - Database and authentication
- **EmailJS** - Contact form emails
- **Google OAuth** - User authentication
- **GitHub Pages** - Static hosting

### **Development Tools**
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **ESLint** - Code quality
- **Prettier** - Code formatting (via IDE)
