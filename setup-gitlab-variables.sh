#!/bin/bash

# GitLab CI/CD Variables Setup Script
# Run this to add the required environment variables to GitLab

echo "🔧 Setting up GitLab CI/CD variables for Fyr Next.js deployment"
echo ""

# Project ID (you can get this from GitLab project settings)
PROJECT_ID="aliaslabs%2Ffyr-next"

# GitLab Personal Access Token (need to create one with api scope)
# echo "Please enter your GitLab Personal Access Token:"
# read -s GITLAB_TOKEN

# For now, display the variables that need to be added manually
echo "📋 Add these variables to GitLab CI/CD:"
echo ""
echo "🔗 Go to: https://gitlab.com/aliaslabs/fyr-next/-/ci_cd/variables"
echo ""
echo "Variables to add:"
echo ""
echo "VERCEL_TOKEN=tgA1o1Vtfd8VVOTvvQ5OY1a8"
echo "  - Type: Variable"
echo "  - Flags: Masked, Protected"
echo "  - Environment: All environments"
echo ""
echo "VERCEL_TEAM_ID=alias-labs"
echo "  - Type: Variable" 
echo "  - Flags: None"
echo "  - Environment: All environments"
echo ""
echo "✅ Vercel environment variables already configured:"
echo "  - CONVEX_URL"
echo "  - NEXT_PUBLIC_CONVEX_URL"
echo "  - NEXT_PUBLIC_SITE_URL"
echo "  - NEXT_PUBLIC_ENVIRONMENT"
echo ""
echo "🚀 After adding these variables, the CI/CD pipeline will work automatically!"
echo ""

# Instructions for creating GitLab token if needed
echo "📝 If you need to create a GitLab Personal Access Token:"
echo "1. Go to https://gitlab.com/-/profile/personal_access_tokens"
echo "2. Create token with 'api' scope"
echo "3. Use the token to authenticate with GitLab CLI"
echo ""