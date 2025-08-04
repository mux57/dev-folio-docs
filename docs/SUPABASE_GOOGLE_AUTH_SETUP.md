# 🔐 Complete Supabase + Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication with Supabase for your portfolio website.

## 📋 **Prerequisites**

- Google account
- Supabase account
- Your portfolio website domain (for production)

---

## 🚀 **Part 1: Google Cloud Console Setup**

### **Step 1: Create Google Cloud Project**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Click "Select a project" → "New Project"**
3. **Enter project details:**
   - Project name: `Portfolio Website Auth`
   - Organization: (leave default)
4. **Click "Create"**

### **Step 2: Enable Google+ API**

1. **Go to [APIs & Services](https://console.cloud.google.com/apis/dashboard)**
2. **Click "+ ENABLE APIS AND SERVICES"**
3. **Search for "Google+ API"**
4. **Click on it and press "Enable"**

### **Step 3: Configure OAuth Consent Screen**

1. **Go to [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)**
2. **Choose "External" user type**
3. **Click "Create"**
4. **Fill in required information:**
   ```
   App name: Your Portfolio Website
   User support email: your-email@gmail.com
   Developer contact: your-email@gmail.com
   ```
5. **Add authorized domains:**
   ```
   localhost (for development)
   yourusername.github.io (for GitHub Pages)
   your-custom-domain.com (if you have one)
   ```
6. **Click "Save and Continue"**
7. **Skip "Scopes" → Click "Save and Continue"**
8. **Add test users (your email) → Click "Save and Continue"**

### **Step 4: Create OAuth Credentials**

1. **Go to [Credentials](https://console.cloud.google.com/apis/credentials)**
2. **Click "+ CREATE CREDENTIALS" → "OAuth client ID"**
3. **Choose "Web application"**
4. **Configure:**
   ```
   Name: Portfolio Website OAuth
   
   Authorized JavaScript origins:
   - http://localhost:8080
   - http://localhost:3000
   - https://yourusername.github.io
   
   Authorized redirect URIs:
   - http://localhost:8080/admin/callback
   - https://yourusername.github.io/your-repo-name/admin/callback
   - https://zfglwpfoshlteckqnbgr.supabase.co/auth/v1/callback
   ```
5. **Click "Create"**
6. **📝 Save the Client ID and Client Secret** (you'll need these)

---

## 🗄️ **Part 2: Supabase Configuration**

### **Step 1: Enable Google Auth in Supabase**

1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Select your project**
3. **Go to Authentication → Providers**
4. **Find "Google" and click "Enable"**
5. **Enter your Google OAuth credentials:**
   ```
   Client ID: (from Google Cloud Console)
   Client Secret: (from Google Cloud Console)
   ```
6. **Click "Save"**

### **Step 2: Configure Redirect URLs**

1. **In Supabase Dashboard → Authentication → URL Configuration**
2. **Add redirect URLs:**
   ```
   Site URL: https://yourusername.github.io/your-repo-name
   
   Redirect URLs:
   - http://localhost:8080/admin/callback
   - https://yourusername.github.io/your-repo-name/admin/callback
   ```
3. **Click "Save"**

### **Step 3: Set Up Row Level Security (RLS)**

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on user_preferences table
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own preferences
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own preferences
CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their own preferences
CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## ⚙️ **Part 3: Environment Configuration**

### **Step 1: Update your .env file**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Authentication Configuration
VITE_USE_SUPABASE_AUTH=true
VITE_ADMIN_EMAIL=your-email@gmail.com

# Google OAuth (Optional - handled by Supabase)
# VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### **Step 2: Add to GitHub Secrets**

Add these secrets to your GitHub repository:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_USE_SUPABASE_AUTH`
- `VITE_ADMIN_EMAIL`

---

## 🧪 **Part 4: Testing Authentication**

### **Local Testing**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:8080/admin`

3. **Click "Sign in with Google"**

4. **Complete OAuth flow**

5. **You should be redirected to:** `http://localhost:8080/admin/callback`

### **Production Testing**

1. **Deploy to GitHub Pages**
2. **Navigate to:** `https://yourusername.github.io/your-repo-name/admin`
3. **Test Google OAuth flow**

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"redirect_uri_mismatch" error:**
   - Check your Google Cloud Console redirect URIs
   - Ensure they match exactly (including trailing slashes)

2. **"Invalid client" error:**
   - Verify Client ID and Secret in Supabase
   - Check if Google+ API is enabled

3. **"Access blocked" error:**
   - Add your domain to authorized domains in OAuth consent screen
   - Add yourself as a test user

4. **User not recognized as admin:**
   - Check if your email matches `VITE_ADMIN_EMAIL`
   - Verify the admin check logic in your code

### **Debug Steps:**

1. **Check browser console for errors**
2. **Verify environment variables are loaded**
3. **Test Supabase connection:**
   ```javascript
   // In browser console
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   ```

---

## 📚 **Next Steps**

- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- [EmailJS Configuration](./EMAILJS_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 🆘 **Need Help?**

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all URLs and credentials
3. Test in incognito mode to avoid cache issues
4. Check Supabase logs in the dashboard
