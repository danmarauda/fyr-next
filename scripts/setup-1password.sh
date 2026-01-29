#!/bin/bash
# Setup 1Password item for ALIAS-Fyr project secrets
# Run: chmod +x scripts/setup-1password.sh && ./scripts/setup-1password.sh

set -e

VAULT="Development"
ITEM="ALIAS-Fyr"

echo "🔐 Setting up 1Password item for ALIAS-Fyr..."

# Check if op CLI is available
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI not found. Install from: https://1password.com/downloads/command-line/"
    exit 1
fi

# Check if signed in
if ! op account list &> /dev/null; then
    echo "❌ Not signed in to 1Password. Run: op signin"
    exit 1
fi

# Check if vault exists, create if not
if ! op vault get "$VAULT" &> /dev/null; then
    echo "📁 Creating vault: $VAULT"
    op vault create "$VAULT"
fi

# Check if item exists
if op item get "$ITEM" --vault "$VAULT" &> /dev/null; then
    echo "✅ Item '$ITEM' already exists in vault '$VAULT'"
    echo "   To update secrets, use: op item edit '$ITEM' --vault '$VAULT'"
else
    echo "📝 Creating item: $ITEM"
    
    # Create the item with all fields
    op item create \
        --category="API Credential" \
        --title="$ITEM" \
        --vault="$VAULT" \
        'BETTER_AUTH_SECRET[password]=' \
        'BETTER_AUTH_URL[text]=http://localhost:3000' \
        'GOOGLE_CLIENT_ID[text]=' \
        'GOOGLE_CLIENT_SECRET[password]=' \
        'CONVEX_DEPLOY_KEY[password]=' \
        'CONVEX_DEPLOYMENT[text]=dev:scrupulous-warbler-611' \
        'CONVEX_URL[text]=https://resilient-dinosaur-332.convex.cloud' \
        'CONVEX_SITE_URL[text]=https://resilient-dinosaur-332.convex.site' \
        'RESEND_API_KEY[password]=' \
        'RESEND_WEBHOOK_SECRET[password]=' \
        'RAILWAY_TOKEN[password]=' \
        'VERCEL_TOKEN[password]='
    
    echo "✅ Created item '$ITEM' in vault '$VAULT'"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Fill in the secret values in 1Password app or via CLI:"
echo "     op item edit '$ITEM' --vault '$VAULT' 'BETTER_AUTH_SECRET=your-secret'"
echo ""
echo "  2. Run your dev server with 1Password:"
echo "     pnpm dev:op"
echo ""
echo "  3. Or inject env vars manually:"
echo "     op run --env-file=.env.1password -- pnpm dev"
