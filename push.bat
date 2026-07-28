@echo off
echo ========================================================
echo   Pushing FoodBridge to GitHub: FoodBridges.git
echo ========================================================
git remote set-url origin https://github.com/Harshithasangam59/FoodBridges.git
git push -u origin main
echo.
echo ========================================================
echo   Done! Press any key to exit.
echo ========================================================
pause
