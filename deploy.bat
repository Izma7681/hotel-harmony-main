@echo off
echo ========================================
echo   Hotel Management System - Deployment
echo ========================================
echo.

echo [1/3] Building production version...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ Build failed! Please fix errors and try again.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Build completed successfully!
echo.

echo [3/3] Deploying to Firebase Hosting...
call firebase deploy --only hosting

if %errorlevel% neq 0 (
    echo.
    echo ❌ Deployment failed! Please check Firebase configuration.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo   ✅ Deployment Successful!
echo ========================================
echo.
echo Your app is now live!
echo Check Firebase Console for the URL.
echo.
pause
