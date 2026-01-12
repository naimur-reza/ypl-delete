@echo off
cd /d "%~dp0"
rmdir /s /q "src\app\[country]\(public)\global-branches"
echo Directory deleted successfully!
pause
