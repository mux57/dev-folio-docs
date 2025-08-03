# 🗄️ Local Database Setup Guide

Your portfolio now supports **SQLite for local development** as an alternative to Supabase! This allows you to develop completely offline without needing internet connectivity.

## 🚀 **How It Works**

The application automatically detects your environment and switches between:
- **SQLite** (Local development on localhost)
- **Supabase** (Production/hosted environments)

## 🔧 **Features**

### ✅ **Automatic Detection**
- Runs SQLite when on `localhost` or `127.0.0.1`
- Uses Supabase for production deployments
- Manual toggle available via UI

### ✅ **Compatible Schema**
- Same database structure as your Supabase migrations
- Supports all your existing tables:
  - `blog_posts` - Your blog content
  - `profiles` - User profiles
  - `user_preferences` - Theme and settings

### ✅ **Sample Data Included**
- Pre-loaded with sample blog posts
- Ready-to-use test data for development
- Matches your existing Supabase content structure

## 🎮 **Usage**

### **Automatic Mode (Recommended)**
Just run your development server - SQLite will be used automatically:
```bash
npm run dev
```

### **Manual Toggle**
Look for the database toggle in the bottom-right corner of your app:
- **Badge shows current mode**: "Local SQLite" or "Supabase Cloud"
- **Switch button**: Click to toggle between modes
- **Requires page refresh** after switching

### **Force Local Mode**
Set localStorage manually:
```javascript
localStorage.setItem('use_local_db', 'true');
// Then refresh the page
```

## 📁 **File Structure**

```
src/
├── database/
│   ├── sqlite-schema.sql      # SQLite-compatible schema
│   └── sqlite-client.ts       # SQLite client implementation
├── integrations/supabase/
│   └── client.ts              # Smart client switcher
└── components/
    └── DatabaseToggle.tsx     # UI toggle component
```

## 🔍 **Development Benefits**

### **Offline Development**
- No internet required
- Faster development cycles
- No API rate limits

### **Data Persistence**
- Uses Web SQL API (Chrome, Safari)
- Falls back to localStorage
- Data persists between sessions

### **Easy Testing**
- Reset data anytime by clearing localStorage
- Consistent test environment
- No external dependencies

## 🛠️ **Technical Details**

### **Storage Methods**
1. **Web SQL** (Primary): Real SQL database in browser
2. **localStorage** (Fallback): JSON-based storage

### **API Compatibility**
The SQLite client implements the same interface as Supabase:
```typescript
// Works with both SQLite and Supabase
const { data, error } = await supabase
  .from('blog_posts')
  .select('*');
```

### **Data Format**
- **Tags**: Stored as JSON strings in SQLite
- **Timestamps**: ISO 8601 format
- **IDs**: Generated using timestamp or random hex

## 🚨 **Important Notes**

### **Browser Support**
- **Web SQL**: Chrome, Safari (deprecated but functional)
- **localStorage**: All modern browsers
- **Automatic fallback** if Web SQL unavailable

### **Data Migration**
- SQLite data is **local only**
- **No automatic sync** between SQLite and Supabase
- Use for development, deploy with Supabase

### **Production Deployment**
- Always uses Supabase in production
- SQLite only for local development
- Environment detection is automatic

## 🎯 **Quick Start**

1. **Start Development**:
   ```bash
   npm run dev
   ```

2. **Check Database Mode**:
   - Look at browser console for: "🔧 Using SQLite for local development"
   - Or check the toggle in bottom-right corner

3. **Test Blog Features**:
   - Visit `/blog` to see sample posts
   - Try `/blog/write` to create new posts
   - All data stored locally

4. **Switch to Supabase**:
   - Click the database toggle
   - Refresh the page
   - Now using cloud database

## 🔧 **Troubleshooting**

### **SQLite Not Working?**
- Check browser console for errors
- Try clearing localStorage: `localStorage.clear()`
- Refresh the page

### **Data Not Persisting?**
- Ensure you're on localhost
- Check if Web SQL is supported
- Data might be in localStorage instead

### **Toggle Not Appearing?**
- Make sure you imported `DatabaseToggle` component
- Check if it's added to your main page
- Look for it in bottom-right corner

## 🎉 **You're All Set!**

Your portfolio now has a complete local development database that mirrors your production Supabase setup. Develop offline, test locally, deploy globally! 🚀
