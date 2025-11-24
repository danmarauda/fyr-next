# 🚀 CI/CD Setup Completion Guide

## ✅ **COMPLETED SO FAR**

### 1. **Build System Fixed**

- ✅ Fixed all TypeScript compilation errors
- ✅ Updated Next.js config (disabled turbopack, webpack config)
- ✅ Fixed radix-ui imports across 26+ UI components
- ✅ Fixed lucide-react icon imports
- ✅ Updated @udecode/plate packages from v46 to v49
- ✅ Fixed environment validation in `src/env.ts`
- ✅ Resolved Convex validation issues

### 2. **Vercel Projects Created**

- ✅ Created 3 Vercel projects in `maraudas-projects` team:
    - `fyr-next-dev` (development)
    - `fyr-next-staging` (staging)
    - `fyr-next` (production)
- ✅ Added production environment variables:
    - `CONVEX_URL`: https://fyr-next.convex.cloud
    - `NEXT_PUBLIC_CONVEX_URL`: https://fyr-next.convex.cloud
    - `NEXT_PUBLIC_SITE_URL`: https://fyr-next.vercel.app

### 3. **GitLab CI/CD Pipeline**

- ✅ Created comprehensive `.gitlab-ci.yml` with multi-stage pipeline
- ✅ Updated deployment scripts with team scope support
- ✅ Configured environments: dev → staging → production
- ✅ Added validation, testing, security, and performance stages

## 🚨 **CURRENT ISSUE: Vercel SSO Protection**

**Problem**: All deployments failing with HTTP 401 SSO authentication errors

- **Root Cause**: `maraudas-projects` team has SSO protection enabled
- **Error Pattern**: `set-cookie: _vercel_sso_nonce=...` + HTTP 401 responses
- **Impact**: Direct deployments blocked, CI/CD pipeline cannot access deployments

## 🎯 **NEXT STEPS TO COMPLETE**

### **Priority 1: Resolve SSO Authentication**

**Option A: Get Vercel API Token (Recommended)**

```bash
# 1. Create Vercel API token in web dashboard
# Visit: https://vercel.com/account/tokens
# Create token named "GitLab CI/CD Token" with deployment permissions

# 2. Add token to GitLab CI/CD variables
# Variable name: VERCEL_TOKEN
# Variable value: <your-token-here>
# Protected: Yes (for production)
# Masked: Yes

# 3. Add team ID to GitLab CI/CD variables
# Variable name: VERCEL_TEAM_ID
# Variable value: maraudas-projects
# Protected: Yes
```

**Option B: Disable Deployment Protection**

```bash
# 1. Go to Vercel Dashboard: https://vercel.com/maraudas-projects
# 2. Navigate to fyr-next project → Settings → Protection
# 3. Disable "Vercel Authentication" for preview deployments
# 4. Keep production protection if desired
```

**Option C: Use Bypass Token**

```bash
# 1. Get bypass token from deployment protection page
# 2. Use format: https://url?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=<token>
# 3. Add to CI/CD as environment variable
```

### **Priority 2: Complete Environment Setup**

**GitLab CI/CD Variables Required:**

```bash
# Required Variables
VERCEL_TOKEN=your_api_token_here
VERCEL_TEAM_ID=maraudas-projects

# Optional: Branch-specific variables
DEV_VERCEL_TOKEN=dev_specific_token
STAGING_VERCEL_TOKEN=staging_specific_token
PROD_VERCEL_TOKEN=prod_specific_token
```

**Environment Variables for Each Project:**

```bash
# Development (fyr-next-dev)
CONVEX_URL=https://fyr-next-dev.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://fyr-next-dev.convex.cloud
NEXT_PUBLIC_SITE_URL=https://fyr-next-dev.vercel.app
NEXT_PUBLIC_ENVIRONMENT=development

# Staging (fyr-next-staging)
CONVEX_URL=https://fyr-next-staging.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://fyr-next-staging.convex.cloud
NEXT_PUBLIC_SITE_URL=https://fyr-next-staging.vercel.app
NEXT_PUBLIC_ENVIRONMENT=staging

# Production (fyr-next) - Already configured
CONVEX_URL=https://fyr-next.convex.cloud
NEXT_PUBLIC_CONVEX_URL=https://fyr-next.convex.cloud
NEXT_PUBLIC_SITE_URL=https://fyr-next.vercel.app
NEXT_PUBLIC_ENVIRONMENT=production
```

### **Priority 3: Test CI/CD Pipeline**

**Manual Testing Steps:**

```bash
# 1. Commit and push to dev branch
git checkout dev
git add .
git commit -m "Configure CI/CD pipeline"
git push origin dev

# 2. Trigger manual deployment in GitLab CI/CD
# Navigate to: https://gitlab.com/aliaslabs/fyr-next/-/pipelines
# Click "Run pipeline" for dev branch

# 3. Monitor deployment logs
# Check for successful Vercel deployment
# Verify environment variables are applied
```

**Automated Testing Steps:**

```bash
# 1. Test staging deployment
git checkout staging
git merge dev
git push origin staging

# 2. Test production deployment
git checkout main
git merge staging
git push origin main

# 3. Verify all environments accessible
curl -I https://fyr-next-dev.vercel.app
curl -I https://fyr-next-staging.vercel.app
curl -I https://fyr-next.vercel.app
```

### **Priority 4: Final Configuration**

**Domain Aliases:**

```bash
# Set up custom domains (optional)
vercel alias set https://fyr-next-dev.vercel.app dev.fyr-next.vercel.app
vercel alias set https://fyr-next-staging.vercel.app staging.fyr-next.vercel.app
vercel alias set https://fyr-next.vercel.app fyr-next.vercel.app
```

**Branch Protection Rules:**

```bash
# In GitLab: Settings → Repository → Protected Branches
# Protect main branch (production)
# Require merge requests for main
# Require pipeline success for merges
```

**Monitoring & Alerts:**

```bash
# Configure deployment notifications
# Set up Slack/Discord webhooks for pipeline status
# Configure error monitoring (Sentry, etc.)
```

## 📋 **QUICK CHECKLIST**

### **Immediate Actions Needed:**

- [ ] Create Vercel API token in dashboard
- [ ] Add VERCEL_TOKEN to GitLab CI/CD variables
- [ ] Add VERCEL_TEAM_ID to GitLab CI/CD variables
- [ ] Configure environment variables for dev/staging projects
- [ ] Test deployment pipeline with dev branch

### **Post-Setup Actions:**

- [ ] Verify all three environments are accessible
- [ ] Set up custom domain aliases
- [ ] Configure branch protection rules
- [ ] Set up monitoring and alerts
- [ ] Document deployment process

## 🔗 **USEFUL LINKS**

- **Vercel Dashboard**: https://vercel.com/maraudas-projects
- **GitLab CI/CD**: https://gitlab.com/aliaslabs/fyr-next/-/ci_cd
- **Vercel API Tokens**: https://vercel.com/account/tokens
- **Project Settings**: https://vercel.com/maraudas-projects/fyr-next/settings

## 📞 **SUPPORT**

If SSO issues persist:

1. Contact Vercel support for team SSO configuration
2. Consider moving project to personal team (billing required)
3. Use alternative deployment method (GitHub Actions, etc.)

---

**Status**: 🟡 **Ready for completion** - Infrastructure complete, waiting for SSO resolution
