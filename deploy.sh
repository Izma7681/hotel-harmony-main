#!/bin/bash

echo "========================================"
echo "  Hotel Management System - Deployment"
echo "========================================"
echo ""

echo "[1/3] Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo ""
echo "[2/3] Build completed successfully!"
echo ""

echo "[3/3] Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed! Please check Firebase configuration."
    exit 1
fi

echo ""
echo "========================================"
echo "  ✅ Deployment Successful!"
echo "========================================"
echo ""
echo "Your app is now live!"
echo "Check Firebase Console for the URL."
echo ""
