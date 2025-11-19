# 🚀 Setup Guide After Cloning from GitHub

## 📋 Prerequisites to Install at School

Before you can run this project, you need to install the following software:

### 1. Node.js (Required)
**What it is**: JavaScript runtime needed to run Angular and npm

**Download**: https://nodejs.org/

**Version**: Download the **LTS (Long Term Support)** version
- Recommended: v20.x or v18.x
- This includes npm (Node Package Manager) automatically

**Installation Steps**:
1. Download the Windows installer (.msi)
2. Run the installer
3. Accept all default settings
4. Click "Install"
5. Restart your computer after installation

**Verify Installation**:
```bash
node --version
# Should show: v20.x.x or similar

npm --version
# Should show: 10.x.x or similar
```

### 2. Git (Required for Cloning)
**What it is**: Version control system to clone the repository

**Download**: https://git-scm.com/download/win

**Installation Steps**:
1. Download Git for Windows
2. Run installer
3. Use default settings (just keep clicking "Next")
4. Finish installation

**Verify Installation**:
```bash
git --version
# Should show: git version 2.x.x
```

### 3. Visual Studio Code (Recommended)
**What it is**: Code editor with great Angular support

**Download**: https://code.visualstudio.com/

**Installation Steps**:
1. Download VS Code for Windows
2. Run installer
3. Check "Add to PATH" during installation
4. Install recommended extensions when prompted

**Recommended Extensions**:
- Angular Language Service
- ESLint
- Prettier
- Material Icon Theme

---

## 📥 Cloning and Setup Steps

### Step 1: Clone the Repository

Open Command Prompt or PowerShell and navigate to where you want the project:

```bash
# Navigate to your desired folder
cd C:\Users\YourUsername\Documents

# Clone the repository (replace with your actual GitHub URL)
git clone https://github.com/YOUR_USERNAME/movie-browser.git

# Navigate into the project
cd movie-browser
```

### Step 2: Install Dependencies

This is the **MOST IMPORTANT** step! You need to install all the npm packages:

```bash
npm install
```

**What this does**:
- Downloads all required packages listed in `package.json`
- Creates a `node_modules` folder (this is NOT in GitHub because it's huge)
- Sets up Angular, Material, and all dependencies
- Takes 2-5 minutes depending on internet speed

**Expected Output**:
```
added 1234 packages in 3m
```

**If you see errors**:
```bash
# Try clearing npm cache first
npm cache clean --force

# Then try install again
npm install
```

### Step 3: Verify Installation

Check if everything installed correctly:

```bash
# Check Angular CLI
npx ng version

# Should show Angular CLI version and all packages
```

### Step 4: Start the Application

```bash
npm start
```

**Expected Output**:
```
✔ Browser application bundle generation complete.
Initial Chunk Files | Names         |  Raw Size
main.js             | main          |   XXX kB
...
✔ Compiled successfully.
** Angular Live Development Server is listening on localhost:4200 **
```

### Step 5: Open in Browser

Open your browser and go to:
```
http://localhost:4200
```

---

## 📦 What Gets Downloaded (npm install)

When you run `npm install`, these packages are downloaded:

### Core Angular Packages (~50 MB)
- @angular/core
- @angular/common
- @angular/compiler
- @angular/platform-browser
- @angular/router
- @angular/forms

### Angular Material (~20 MB)
- @angular/material
- @angular/cdk

### Development Tools (~100 MB)
- @angular/cli
- TypeScript
- Webpack
- Testing frameworks

### Other Dependencies (~30 MB)
- RxJS (reactive programming)
- Zone.js (change detection)
- Various utilities

**Total Download Size**: ~200-300 MB
**Total Disk Space**: ~400-500 MB (with node_modules)

---

## 🔑 Important Files NOT in GitHub

These files are in `.gitignore` and won't be cloned:

### 1. node_modules/ (HUGE folder)
- Contains all npm packages
- ~400 MB
- **Must run `npm install` to recreate**

### 2. .angular/ (Build cache)
- Angular build cache
- Automatically created when you run the app

### 3. dist/ (Build output)
- Compiled production files
- Created when you run `npm run build`

---

## ⚙️ Configuration Files (Already in GitHub)

These important files ARE included:

✅ **package.json** - Lists all dependencies
✅ **package-lock.json** - Locks exact versions
✅ **angular.json** - Angular configuration
✅ **tsconfig.json** - TypeScript configuration
✅ **src/** - All source code
✅ **.gitignore** - Tells Git what to ignore
✅ **README.md** - Project documentation

---

## 🎯 Quick Start Checklist

After cloning at school, follow this checklist:

- [ ] Install Node.js (if not already installed)
- [ ] Install Git (if not already installed)
- [ ] Clone the repository
- [ ] Navigate to project folder: `cd movie-browser`
- [ ] Run: `npm install` (WAIT for it to complete!)
- [ ] Run: `npm start`
- [ ] Open browser: `http://localhost:4200`
- [ ] Login with: user / pass
- [ ] Test search functionality

---

## 🐛 Common Issues and Solutions

### Issue 1: "npm is not recognized"
**Problem**: Node.js not installed or not in PATH

**Solution**:
1. Install Node.js from nodejs.org
2. Restart Command Prompt
3. Try again

### Issue 2: "npm install" fails
**Problem**: Network issues or corrupted cache

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try install again
npm install

# If still fails, delete node_modules and try again
rmdir /s node_modules
npm install
```

### Issue 3: Port 4200 already in use
**Problem**: Another app is using port 4200

**Solution**:
```bash
# Use a different port
ng serve --port 4300

# Or find and kill the process using port 4200
netstat -ano | findstr :4200
taskkill /PID <PID_NUMBER> /F
```

### Issue 4: "Cannot find module '@angular/core'"
**Problem**: Dependencies not installed

**Solution**:
```bash
# Make sure you're in the project folder
cd movie-browser

# Install dependencies
npm install
```

### Issue 5: Build errors after cloning
**Problem**: Different Node.js version or corrupted install

**Solution**:
```bash
# Delete node_modules and package-lock.json
rmdir /s node_modules
del package-lock.json

# Reinstall everything
npm install
```

---

## 💾 Disk Space Requirements

Make sure you have enough space:

- **Project Source Code**: ~5 MB
- **node_modules**: ~400 MB
- **Build Cache**: ~50 MB
- **Total Required**: ~500 MB free space

---

## 🌐 Internet Requirements

### Initial Setup (First Time):
- **Download Size**: ~300 MB
- **Time**: 3-10 minutes (depends on school internet)
- **Required**: Yes, must download packages

### Running the App:
- **Internet**: Required for OMDB API calls
- **Data Usage**: Minimal (~1-2 MB per session)
- **Offline**: App won't load movies without internet

---

## 🔐 API Key Note

The OMDB API key is already in the code:
```
API Key: 9bd82f91
```

This key is included in the repository in:
```
src/app/services/movie.service.ts
```

**No additional setup needed for the API key!**

---

## 📱 School Computer Considerations

### If You Don't Have Admin Rights:

1. **Node.js Portable**:
   - Download Node.js portable version
   - Extract to your user folder
   - Add to PATH manually

2. **Use School's Installed Software**:
   - Check if Node.js is already installed
   - Run: `node --version` to check

3. **Ask IT Department**:
   - Request Node.js installation
   - Usually approved for development purposes

### If Firewall Blocks npm:

1. **Use School Proxy**:
   ```bash
   npm config set proxy http://proxy.school.edu:8080
   npm config set https-proxy http://proxy.school.edu:8080
   ```

2. **Download on Personal Computer**:
   - Run `npm install` at home
   - Copy entire project folder (including node_modules) to USB
   - Transfer to school computer
   - **Note**: node_modules is large (~400 MB)

---

## ✅ Verification Steps

After setup, verify everything works:

### 1. Check Node.js
```bash
node --version
npm --version
```

### 2. Check Project Structure
```bash
dir
# Should see: src, node_modules, package.json, etc.
```

### 3. Check Dependencies
```bash
npm list --depth=0
# Should show all installed packages
```

### 4. Start App
```bash
npm start
# Should compile and start server
```

### 5. Test in Browser
- Open: http://localhost:4200
- Login: user / pass
- Search: "inception"
- Should see movies!

---

## 📞 Getting Help

If you encounter issues:

1. **Check Console Errors**: Press F12 in browser
2. **Check Terminal Output**: Look for error messages
3. **Google the Error**: Copy exact error message
4. **Check Documentation**: Read the other .md files in project

---

## 🎓 Summary for School Setup

**Minimum Requirements**:
1. ✅ Node.js installed
2. ✅ Git installed (to clone)
3. ✅ 500 MB free disk space
4. ✅ Internet connection

**Setup Commands** (in order):
```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/movie-browser.git

# 2. Navigate to project
cd movie-browser

# 3. Install dependencies (IMPORTANT!)
npm install

# 4. Start application
npm start

# 5. Open browser
# Go to: http://localhost:4200
```

**Total Time**: 10-15 minutes (including downloads)

---

**Good luck with your project! 🚀**
