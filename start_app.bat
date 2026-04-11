@echo off
echo Starting YouTube Clipper...

:: Start Backend
start cmd /k "cd server && npm run dev"

:: Start Frontend
start cmd /k "cd client && npm run dev"

echo Done! Servers are starting in new windows.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
pause
