# 🚀 Deployment Guide - GitHub Pages

Complete guide to deploy your portfolio to GitHub Pages with secure environment variables.

## 📋 **Prerequisites**

- GitHub account
- Repository with your portfolio code
- All environment variables configured

## 🔧 **Step 1: Repository Setup**

### **1.1 Enable GitHub Pages**
1. **Go to your repository on GitHub**
2. **Click "Settings" tab**
3. **Scroll to "Pages" in left sidebar**
4. **Under "Source", select "GitHub Actions"**
5. **Click "Save"**

### **1.2 Verify Repository Name**
Your site will be available at:
```
https://yourusername.github.io/repository-name/
```

## 🔐 **Step 2: Add GitHub Secrets**

Go to **Settings** → **Secrets and variables** → **Actions** and add these secrets:

### **Required Secrets (13 total):**

| Secret Name | Example Value | Description |
|-------------|---------------|-------------|
| `VITE_SUPABASE_URL` | `https://abc123.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Supabase anonymous key |
| `VITE_USE_SUPABASE_AUTH` | `true` | Enable Supabase authentication |
| `VITE_ADMIN_EMAIL` | `your-email@gmail.com` | Admin email for authentication |
| `VITE_SUPABASE_PROJECT_ID` | `abc123` | Supabase project ID |
| `VITE_EMAILJS_SERVICE_ID` | `service_abc123` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_xyz789` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | `abcd1234efgh5678` | EmailJS public key |
| `VITE_CONTACT_EMAIL` | `your-email@gmail.com` | Your contact email |
| `VITE_CONTACT_PHONE` | `+1 234 567 8900` | Your phone number |
| `VITE_GITHUB_USERNAME` | `yourusername` | Your GitHub username |
| `VITE_LINKEDIN_USERNAME` | `yourlinkedin` | Your LinkedIn username |
| `VITE_LOCATION` | `Your City, Country` | Your location |

### **How to Add Secrets:**
1. **Click "New repository secret"**
2. **Enter the name exactly as shown above**
3. **Paste the value**
4. **Click "Add secret"**
5. **Repeat for all 13 secrets**

## ⚙️ **Step 3: Configure Build Settings**

The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`. It will:

1. **Install dependencies**
2. **Create environment file from secrets**
3. **Build the project**
4. **Deploy to GitHub Pages**

## 🚀 **Step 4: Deploy**

### **Automatic Deployment:**
```bash
# Push to main branch to trigger deployment
git add .
git commit -m "feat: deploy to GitHub Pages"
git push origin main
```

### **Monitor Deployment:**
1. **Go to "Actions" tab in your repository**
2. **Watch the deployment progress**
3. **Green checkmark = successful deployment**
4. **Red X = deployment failed (check logs)**

## 🌐 **Step 5: Access Your Site**

Your portfolio will be available at:
```
https://yourusername.github.io/repository-name/
```

## 🔧 **Step 6: Custom Domain (Optional)**

### **6.1 Add Custom Domain**
1. **In repository Settings → Pages**
2. **Enter your custom domain**
3. **Enable "Enforce HTTPS"**

### **6.2 Configure DNS**
Add these DNS records with your domain provider:
```
Type: CNAME
Name: www
Value: yourusername.github.io

Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **404 Page Not Found:**
   - Check if GitHub Pages is enabled
   - Verify the repository name in `vite.config.ts`
   - Ensure deployment was successful

2. **Environment Variables Not Working:**
   - Verify all 13 secrets are added correctly
   - Check secret names match exactly
   - Redeploy after adding secrets

3. **Build Failures:**
   - Check Actions tab for error logs
   - Verify all dependencies are in `package.json`
   - Check for TypeScript errors

4. **Authentication Not Working:**
   - Update Google OAuth redirect URLs
   - Update Supabase redirect URLs
   - Check admin email configuration

### **Debug Steps:**

1. **Check deployment logs in Actions tab**
2. **Verify environment variables:**
   ```javascript
   // In browser console on deployed site
   console.log('Environment check:', {
     supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
     adminEmail: !!import.meta.env.VITE_ADMIN_EMAIL,
     emailjsService: !!import.meta.env.VITE_EMAILJS_SERVICE_ID
   });
   ```

## 📊 **Deployment Checklist**

- [ ] GitHub Pages enabled
- [ ] All 13 secrets added
- [ ] Google OAuth URLs updated
- [ ] Supabase redirect URLs updated
- [ ] EmailJS configuration tested
- [ ] Repository name in vite.config.ts correct
- [ ] Deployment successful (green checkmark)
- [ ] Site accessible at GitHub Pages URL
- [ ] Authentication working
- [ ] Contact form working

## 🔄 **Updating Your Site**

To update your deployed site:
```bash
# Make your changes
git add .
git commit -m "update: your changes"
git push origin main
```

The site will automatically redeploy with your changes.

## 🔗 **Related Guides**

- [Supabase + Google Auth Setup](./SUPABASE_GOOGLE_AUTH_SETUP.md)
- [EmailJS Setup](./EMAILJS_SETUP.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)
