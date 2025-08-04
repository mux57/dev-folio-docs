# Environment Variables Setup

## 🔧 Required Environment Variables

### **Supabase Configuration**

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# Service Role Key (Keep this secret - only for server-side operations)
# VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Authentication Configuration
VITE_USE_SUPABASE_AUTH=true
VITE_ADMIN_EMAIL=your-admin-email@gmail.com

# Project Configuration
VITE_SUPABASE_PROJECT_ID=your-project-id
```

## 📋 How to Get These Values

### **1. VITE_SUPABASE_URL**
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Go to Settings → API
- Copy the "Project URL"

### **2. VITE_SUPABASE_ANON_KEY**
- In the same API settings page
- Copy the "anon public" key
- This is safe to use in frontend code

### **3. VITE_SUPABASE_SERVICE_ROLE_KEY** (Optional)
- In the same API settings page
- Copy the "service_role secret" key
- ⚠️ Keep this secret - only use for server-side operations

### **4. VITE_ADMIN_EMAIL**
- Your Gmail address that should have admin access
- Only this email can create/edit/delete blog posts

### **5. VITE_SUPABASE_PROJECT_ID**
- This is the part before `.supabase.co` in your project URL
- Example: if URL is `https://abc123.supabase.co`, then project ID is `abc123`

## 🔒 Security Notes

- ✅ **Safe to commit**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_EMAIL`
- ❌ **Never commit**: `VITE_SUPABASE_SERVICE_ROLE_KEY`
- 📝 **Add to .gitignore**: `.env` file (already done)
- 📋 **Use .env.example**: For sharing configuration template

## 🚀 Usage

### **Development**
```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env

# Start development server
npm run dev
```

### **Production**
Set these environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Railway: Variables tab

## 🧪 Testing Configuration

### **Verify Environment Variables**
```javascript
// In browser console
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Admin Email:', import.meta.env.VITE_ADMIN_EMAIL);
console.log('Use Supabase Auth:', import.meta.env.VITE_USE_SUPABASE_AUTH);
```

### **Test Database Connection**
```javascript
// In browser console
verifyDatabase()
```

## 🔄 Switching Between Local and Supabase

### **Use Supabase (Production)**
```env
VITE_USE_SUPABASE_AUTH=true
```

### **Use Local Mock (Development)**
```env
VITE_USE_SUPABASE_AUTH=false
```

Or use browser console:
```javascript
// Enable Supabase
enableSupabaseAuth()

// Disable Supabase (use local mock)
disableSupabaseAuth()
```
