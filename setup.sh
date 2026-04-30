#!/bin/bash

# Physics Learning Platform - Quick Setup Script
# This script helps you:
# 1. Clear database
# 2. Setup git
# 3. Push to GitHub

echo "🚀 Physics Learning Platform - Quick Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Clear Database
read -p "Do you want to clear all users and chapters from database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🗑️  Clearing database...${NC}"
    cd backend
    node cleanup.js
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database cleared successfully!${NC}"
    else
        echo -e "${RED}❌ Error clearing database${NC}"
        exit 1
    fi
    cd ..
    echo ""
fi

# Step 2: Check .env files
echo -e "${YELLOW}🔍 Checking .env files...${NC}"
if [ -f backend/.env ]; then
    echo -e "${GREEN}✅ backend/.env exists${NC}"
else
    echo -e "${YELLOW}⚠️  backend/.env not found, copying from .env.example${NC}"
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env with your configuration"
fi

if [ -f frontend/.env ]; then
    echo -e "${GREEN}✅ frontend/.env exists${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/.env not found, creating one${NC}"
    echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env
fi
echo ""

# Step 3: Git setup
echo -e "${YELLOW}🔧 Setting up Git...${NC}"
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "No remote repository found"
    read -p "Enter GitHub repository URL (https://github.com/username/repo.git): " github_url
    if [ -n "$github_url" ]; then
        git remote add origin "$github_url"
        echo -e "${GREEN}✅ Remote repository added${NC}"
    fi
else
    remote_url=$(git remote get-url origin)
    echo -e "${GREEN}✅ Remote repository: $remote_url${NC}"
fi
echo ""

# Step 4: Check .gitignore
echo -e "${YELLOW}🔐 Verifying .gitignore...${NC}"
if grep -q ".env" .gitignore; then
    echo -e "${GREEN}✅ .env files are properly ignored${NC}"
else
    echo -e "${YELLOW}⚠️  .gitignore doesn't properly exclude .env files${NC}"
fi
echo ""

# Step 5: Git status
echo -e "${YELLOW}📊 Git status:${NC}"
git status --short
echo ""

# Step 6: Ready to push
read -p "Do you want to commit and push to GitHub now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter commit message (default: 'chore: clean database and push updates'): " commit_msg
    commit_msg=${commit_msg:-"chore: clean database and push updates"}
    
    echo -e "${YELLOW}📤 Staging and committing...${NC}"
    git add .
    git commit -m "$commit_msg"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Changes committed${NC}"
        
        echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
        git push -u origin main
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
        else
            echo -e "${RED}❌ Error pushing to GitHub. Check your credentials.${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}ℹ️  Nothing to commit${NC}"
    fi
    echo ""
fi

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
