# 🚀 Vercel Deployment Guide - GopGop

## ✅ Repository Successfully Pushed
- **GitHub Repository:** https://github.com/hackhaveli/gopgop
- **Status:** All code pushed to `main` branch

---

## 📋 Step-by-Step Deployment to Vercel (FREE)

### **Step 1: Create Vercel Account**
1. Go to: **https://vercel.com**
2. Click **"Sign Up"** (or **"Login"** if you have an account)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

### **Step 2: Import Your Project**
1. Once logged in, click **"Add New..."** → **"Project"**
2. Find your repository: **`hackhaveli/gopgop`**
3. Click **"Import"**

---

### **Step 3: Configure Project Settings**

Vercel will auto-detect Next.js settings:
- ✅ Framework Preset: **Next.js**
- ✅ Root Directory: **`.`** (default)
- ✅ Build Command: **`npm run build`**
- ✅ Output Directory: **`.next`**

**Leave these settings as default!**

---

### **Step 4: Add Environment Variables** ⚠️ **CRITICAL**

**BEFORE clicking "Deploy"**, scroll down to **"Environment Variables"** section and add these:

#### **Required Variables:**

```
NEXT_PUBLIC_SUPABASE_URL
```
**Value:**
```
https://atmggqtuwczthppksbvj.supabase.co
```

---

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bWdncXR1d2N6dGhwcGtzYnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0OTQyODEsImV4cCI6MjA4NTA3MDI4MX0.zvRfwfLDcfDzMFDLqSnZCJ19sbAdSdthz9cpbakx-OI
```

---

```
SUPABASE_SERVICE_ROLE_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0bWdncXR1d2N6dGhwcGtzYnZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQ5NDI4MSwiZXhwIjoyMDg1MDcwMjgxfQ.g3fy_-gKw2xNtU5JcFKIGGb8dKFQHGWJ6TWuN0Jjl_4
```

---

```
NEXT_PUBLIC_SITE_URL
```
**Value:** (You'll update this after first deploy)
```
https://gopgop.vercel.app
```

---

#### **Optional Variables (for future features):**

```
CLOUDINARY_CLOUD_NAME
```
**Value:**
```
dhygf3qv5
```

---

```
CLOUDINARY_API_KEY
```
**Value:**
```
874314357572296
```

---

```
CLOUDINARY_API_SECRET
```
**Value:**
```
g_Uekxh4N8SwBnUh27OeOlmR9qU
```

---

### **Step 5: Deploy! 🚀**
1. After adding all environment variables, click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll get a live URL like: `https://gopgop.vercel.app` or `https://gopgop-<random>.vercel.app`

---

### **Step 6: Update Site URL** (After First Deploy)

After your first deployment:
1. Copy your actual Vercel URL (e.g., `https://gopgop.vercel.app`)
2. Go to Vercel → Your Project → **"Settings"** → **"Environment Variables"**
3. Edit `NEXT_PUBLIC_SITE_URL` and update it with your real Vercel URL
4. Click **"Save"**
5. Go to **"Deployments"** → Click the three dots on latest deployment → **"Redeploy"**

---

### **Step 7: Configure Supabase** 🔐

**Important:** Update your Supabase project to allow authentication from Vercel:

1. Go to: **https://supabase.com/dashboard**
2. Select your project: **atmggqtuwczthppksbvj**
3. Navigate to: **Authentication** → **URL Configuration**
4. Update these settings:

   **Site URL:**
   ```
   https://gopgop.vercel.app
   ```

   **Redirect URLs:** (Add these)
   ```
   https://gopgop.vercel.app/**
   http://localhost:3000/**
   ```

5. Click **"Save"**

---

## 🎉 You're Done!

Your app should now be live at your Vercel URL!

### **Test Your Deployment:**
1. Visit your Vercel URL
2. Test login/signup functionality
3. Check that all features work correctly

---

## 🆘 Troubleshooting

### **Build Failed?**
- Check the build logs in Vercel dashboard
- Ensure all environment variables are correctly set
- Make sure there are no syntax errors in your code

### **Authentication Not Working?**
- Verify Supabase redirect URLs are set correctly
- Check that all Supabase environment variables are correct
- Ensure `NEXT_PUBLIC_SITE_URL` matches your actual Vercel URL

### **Images Not Loading?**
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for API limits

---

## 📞 Need Help?

If you encounter any issues, check:
1. Vercel deployment logs
2. Browser console for errors
3. Supabase dashboard for authentication logs

---

**Good luck! 🚀**
