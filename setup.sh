#!/bin/bash

# Urdu Flipbook Platform - Quick Setup Script
# This script helps you get started quickly with the platform

echo "📚 اردو فلیپ بوک پلیٹ فارم - Quick Setup"
echo "======================================"
echo ""

# Check if page-flip.mp3 exists
if [ ! -f "public/page-flip.mp3" ]; then
    echo "⚠️  WARNING: page-flip.mp3 not found in /public folder"
    echo "   Please add a page-flip sound effect for the best experience"
    echo "   See /public/ASSETS_README.md for instructions"
    echo ""
fi

# Check if admin exists
echo "🔍 Checking admin account..."
ADMIN_EXISTS=$(bunx prisma db execute --stdin <<EOF
SELECT COUNT(*) as count FROM Admin;
EOF 2>/dev/null | grep -o '[0-9]*' | head -1)

if [ -z "$ADMIN_EXISTS" ] || [ "$ADMIN_EXISTS" -eq 0 ]; then
    echo "ℹ️  No admin account found. You'll need to create one."
    echo "   Visit: http://localhost:3000/admin/setup"
    echo ""
else
    echo "✅ Admin account exists"
    echo "   Visit: http://localhost:3000/admin/login"
    echo ""
fi

# Check if any books exist
BOOK_COUNT=$(bunx prisma db execute --stdin <<EOF
SELECT COUNT(*) as count FROM Book;
EOF 2>/dev/null | grep -o '[0-9]*' | head -1)

if [ -z "$BOOK_COUNT" ] || [ "$BOOK_COUNT" -eq 0 ]; then
    echo "ℹ️  No books found. Create your first book in the admin dashboard."
    echo ""
else
    echo "✅ Found $BOOK_COUNT book(s) in the database"
    echo ""
fi

# Start the server
echo "🚀 Starting development server..."
echo "   Home:     http://localhost:3000"
echo "   Admin:    http://localhost:3000/admin"
echo "   Setup:    http://localhost:3000/admin/setup"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

bun run dev
