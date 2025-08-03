# 📧 EmailJS Setup Guide

Complete guide to set up EmailJS for your portfolio contact form.

## 🚀 **Step 1: Create EmailJS Account**

1. **Go to [EmailJS](https://www.emailjs.com/)**
2. **Click "Sign Up" and create account**
3. **Verify your email address**

## 📧 **Step 2: Add Email Service**

1. **Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)**
2. **Click "Add New Service"**
3. **Choose your email provider:**
   - **Gmail** (recommended)
   - **Outlook**
   - **Yahoo**
   - **Custom SMTP**

### **For Gmail:**
1. **Select "Gmail"**
2. **Click "Connect Account"**
3. **Sign in with your Gmail account**
4. **Grant permissions**
5. **Your Service ID will be generated** (e.g., `service_abc123`)

## 📝 **Step 3: Create Email Template**

1. **Go to "Email Templates"**
2. **Click "Create New Template"**
3. **Use this template:**

```html
Subject: New Contact from {{from_name}} - Portfolio Website

Hello,

You have received a new message from your portfolio website:

From: {{from_name}}
Email: {{from_email}}
Company: {{company}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from your portfolio contact form.
Reply directly to this email to respond to {{from_name}}.
```

4. **Click "Save"**
5. **Note your Template ID** (e.g., `template_xyz789`)

## 🔑 **Step 4: Get API Keys**

1. **Go to "Account" → "API Keys"**
2. **Copy your Public Key** (e.g., `abcd1234efgh5678`)
3. **This is your `VITE_EMAILJS_PUBLIC_KEY`**

## ⚙️ **Step 5: Update Environment Variables**

Add these to your `.env` file:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abcd1234efgh5678
```

## 🧪 **Step 6: Test Your Setup**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Go to the contact section**
3. **Fill out the form and submit**
4. **Check your email for the message**

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"EmailJS configuration missing" error:**
   - Check your environment variables
   - Restart your development server

2. **"Failed to send email" error:**
   - Verify Service ID, Template ID, and Public Key
   - Check EmailJS dashboard for error logs

3. **Email not received:**
   - Check spam folder
   - Verify email template is correct
   - Test with different email addresses

### **Debug Steps:**

```javascript
// Test in browser console
console.log('EmailJS Config:', {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
});
```

## 📊 **EmailJS Dashboard Features**

- **Email History:** View all sent emails
- **Usage Statistics:** Monitor your quota
- **Template Editor:** Customize email templates
- **Service Management:** Manage email providers

## 💡 **Best Practices**

1. **Use descriptive template variables**
2. **Include sender's email for easy replies**
3. **Add spam protection (already implemented)**
4. **Monitor your monthly quota**
5. **Test regularly to ensure functionality**

## 🔗 **Related Guides**

- [Supabase + Google Auth Setup](./SUPABASE_GOOGLE_AUTH_SETUP.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
