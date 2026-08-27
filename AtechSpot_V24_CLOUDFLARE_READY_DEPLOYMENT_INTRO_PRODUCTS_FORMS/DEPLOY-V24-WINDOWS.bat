@echo off
title ATechSpot V24 Cloudflare Deployment
echo Installing the current Cloudflare deployment tool...
call npm install
if errorlevel 1 goto error
echo Signing in to Cloudflare if required...
call npx wrangler whoami
if errorlevel 1 call npx wrangler login
echo Deploying ATechSpot V24 to production...
call npm run deploy
if errorlevel 1 goto error
echo.
echo Deployment completed. Open https://www.atechspot.com/
pause
exit /b 0
:error
echo.
echo Deployment stopped because Cloudflare returned an error.
echo Do not change DNS. Copy the error message for troubleshooting.
pause
exit /b 1
