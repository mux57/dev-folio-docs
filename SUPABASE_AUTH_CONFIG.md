# Supabase Authentication Configuration

## 🔧 Required Supabase Settings

### **Step 1: Add Redirect URLs**

1. **Go to**: [Supabase Auth Settings](https://supabase.com/dashboard/project/zfglwpfoshlteckqnbgr/auth/url-configuration)

2. **Add these URLs to "Redirect URLs"**:
   ```
   http://localhost:8081/admin/callback
   https://your-domain.com/admin/callback
   ```

3. **Click "Save"**

### **Step 2: Configure Site URL**

1. **Set "Site URL"** to:
   ```
   http://localhost:8081
   ```
   (For production, use your actual domain)

### **Step 3: Enable Google OAuth**

1. **Go to**: [Supabase Auth Providers](https://supabase.com/dashboard/project/zfglwpfoshlteckqnbgr/auth/providers)

2. **Enable Google provider** if not already enabled

3. **Add your Google OAuth credentials**:
   - Client ID
   - Client Secret

## 🔄 Fixed Authentication Flow

### **Before (BROKEN):**
```
1. User clicks "Login with Google"
2. Redirects to /blog/write immediately ❌
3. Google OAuth popup appears AFTER redirect ❌
4. User is on /blog/write but not authenticated ❌
```

### **After (FIXED):**
```
1. User clicks "Login with Google"
2. Redirects to Google OAuth ✅
3. User completes Google login ✅
4. Google redirects to /admin/callback ✅
5. AuthCallback processes authentication ✅
6. Redirects to /blog/write if admin ✅
7. Or shows error if not admin ✅
```

## 🧪 Testing the Fixed Flow

### **Test 1: Admin Login**
1. Go to `/admin/login`
2. Click "Continue with Google"
3. Should redirect to Google OAuth (not /blog/write)
4. Complete Google login
5. Should redirect to `/admin/callback`
6. Should show "Completing Login..." spinner
7. Should redirect to `/blog/write` if admin email
8. Should show success toast

### **Test 2: Non-Admin Login**
1. Login with non-admin Google account
2. Should redirect to `/admin/callback`
3. Should show "Access Denied" error
4. Should redirect to `/blog`

### **Test 3: Failed Login**
1. Cancel Google OAuth
2. Should redirect to `/admin/callback`
3. Should show "Login Failed" error
4. Should redirect back to `/admin/login`

## 🚨 Important Notes

- **Always test in incognito** to ensure clean auth state
- **Check browser console** for detailed auth logs
- **Verify redirect URLs** are added to Supabase settings
- **Admin email must be**: `mukeshknit57@gmail.com`
