# Git Workflow & Database Cleanup Guide

## 🔧 Step 1: Fix .gitignore (Already Done ✅)

The `.gitignore` file has been updated to exclude:
- ✅ `.env` files (all variants)
- ✅ `node_modules/`
- ✅ IDE files
- ✅ Build outputs
- ✅ Logs
- ✅ Uploads directory

---

## 🗑️ Step 2: Clear Database (Delete All Users & Chapters)

### Option A: Using Cleanup Script (Recommended)

```bash
# Navigate to backend
cd backend

# Run cleanup script
node cleanup.js
```

**Output:**
```
✅ MongoDB connected
🔄 Starting database cleanup...
✅ Deleted X chapters
✅ Deleted Y users
✅ Database cleanup completed successfully!
```

### Option B: Using MongoDB Shell (Manual)

```bash
# Open MongoDB shell
mongosh mongodb://localhost:27017

# Use your database
use physics-learning-platform

# Delete all chapters
db.chapters.deleteMany({})

# Delete all users
db.users.deleteMany({})

# Verify deletion
db.chapters.countDocuments()  # Should be 0
db.users.countDocuments()     # Should be 0

# Exit
exit
```

### Option C: Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `physics-learning-platform` database
4. Click on `chapters` collection → Select All → Delete
5. Click on `users` collection → Select All → Delete

---

## 🔐 Step 3: Remove .env Files from Git History

If `.env` files were already committed, remove them from git history:

```bash
# Remove .env files from git history (from project root)
git rm --cached .env
git rm --cached backend/.env
git rm --cached frontend/.env
git rm --cached backend/.env.example  # Keep this one!

# Commit the removal
git add .gitignore
git commit -m "chore: remove .env files from git history and update gitignore"

# Force push if already pushed
git push origin main --force-with-lease
```

**Or use this one-liner:**
```bash
git rm --cached -r . && git add . && git commit -m "chore: update gitignore and remove cached .env files"
```

---

## 📤 Step 4: Push to GitHub

### First Time Setup (if repository doesn't exist on GitHub):

```bash
# Initialize git (if not done)
git init

# Add remote repository
git remote add origin https://github.com/yourusername/bsc-physics-platform.git

# Verify remote
git remote -v
```

### Push to GitHub:

```bash
# Navigate to project root
cd /home/yogess/bsc-physics-platform

# Stage all changes
git add .

# Commit with message
git commit -m "feat: implement security, validation, rate limiting, and documentation"

# Push to GitHub
git push -u origin main

# If you get an error about main vs master:
git push -u origin HEAD:main
```

---

## 📥 Step 5: Pull from GitHub

### Initial Clone (first time):

```bash
# Clone the repository
git clone https://github.com/yourusername/bsc-physics-platform.git
cd bsc-physics-platform

# Install dependencies
cd backend
npm install
cd ../frontend
npm install
```

### Update Existing Copy:

```bash
# Navigate to project root
cd /home/yogess/bsc-physics-platform

# Pull latest changes
git pull origin main

# Install any new dependencies
cd backend
npm install
cd ../frontend
npm install
```

---

## 🔄 Complete Workflow Summary

### Clean Start Process:

```bash
# 1. Navigate to backend
cd /home/yogess/bsc-physics-platform/backend

# 2. Clear database
node cleanup.js

# 3. Go to project root
cd ..

# 4. Stage and commit
git add .
git commit -m "chore: clear database and update gitignore"

# 5. Push to GitHub
git push origin main

# Done! ✅
```

### For Next Developments:

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes
# ... edit files ...

# 3. Stage changes
git add .

# 4. Commit with meaningful message
git commit -m "feat: add description of changes"

# 5. Push to GitHub
git push origin feature/your-feature-name

# 6. Create Pull Request on GitHub (optional)
# 7. Merge to main
# 8. Pull latest changes locally
git checkout main
git pull origin main
```

---

## 📋 Git Commands Reference

```bash
# Check status
git status

# View commit history
git log --oneline

# View branches
git branch -a

# Create new branch
git checkout -b branch-name

# Switch branch
git checkout branch-name

# Delete branch
git branch -d branch-name

# Stage specific file
git add filename

# Stage all changes
git add .

# Unstage file
git reset filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View differences
git diff
git diff HEAD

# View what will be committed
git diff --cached

# Stash changes (temporary save)
git stash

# Apply stashed changes
git stash pop

# View remotes
git remote -v

# Add remote
git remote add origin url

# Rename remote
git remote rename origin upstream
```

---

## 🚨 Important Notes

### Before Pushing:

1. **Check status:**
   ```bash
   git status
   ```

2. **Review changes:**
   ```bash
   git diff
   ```

3. **Never commit:**
   - `.env` files with secrets
   - `node_modules/` directory
   - Build outputs
   - IDE configuration files

### Environment Variables:

**Always keep `.env.example`** with placeholder values:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/db
JWT_SECRET=your-super-secret-key
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

Users can copy `.env.example` to `.env` and fill in actual values.

### GitHub Setup:

1. Go to https://github.com/new
2. Create new repository with name: `bsc-physics-platform`
3. Choose public or private
4. Do NOT initialize with README, .gitignore, or license (we have them)
5. Click "Create repository"
6. Follow the instructions to push existing repository

---

## 🔍 Verify Everything is Working

```bash
# Check git remote is set correctly
git remote -v
# Output should show: origin  https://github.com/yourusername/bsc-physics-platform.git

# Check branch
git branch
# Output should show: * main (or * master)

# Check status
git status
# Output should show: "On branch main, nothing to commit, working tree clean"

# Verify .env files are ignored
git status
# Should NOT show any .env files

# View what would be pushed
git log --oneline origin/main..HEAD
```

---

## 💡 Tips & Tricks

### See what files would be committed:
```bash
git diff --cached --name-only
```

### Commit with longer message:
```bash
git commit -m "feat: add feature" -m "Detailed description here"
```

### Amend last commit:
```bash
git add .
git commit --amend --no-edit
```

### View file history:
```bash
git log -- filename
```

### See who changed what:
```bash
git blame filename
```

---

## ❌ Troubleshooting

### "Permission denied (publickey)" when pushing:

```bash
# Add SSH key to GitHub
ssh-keygen -t ed25519 -C "your-email@example.com"
# Then add the public key to GitHub settings
```

### ".env file already in git history":

```bash
# Remove from history
git rm --cached .env
git commit -m "remove .env file"
git push
```

### "Rejected: updates were rejected":

```bash
# Pull latest and resolve conflicts
git pull origin main
# Fix any conflicts
git add .
git commit -m "resolve merge conflicts"
git push origin main
```

### "working tree clean but files show as untracked":

```bash
# Re-add gitignore
git rm -r --cached .
git add .
git commit -m "fix: update gitignore"
```

---

## ✅ Completion Checklist

- [ ] `.gitignore` updated with `.env` files
- [ ] Database cleared (users & chapters deleted)
- [ ] `.env` files removed from git history
- [ ] GitHub repository created
- [ ] Remote URL added to local git
- [ ] Changes committed and pushed to GitHub
- [ ] Verified `.env` files are not in git
- [ ] `.env.example` file exists and in git

---

For more help: https://git-scm.com/doc
