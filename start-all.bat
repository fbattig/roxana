@echo off
echo Starting Roxana Application...

REM Start the backend server
echo Starting backend server on port 3004...
start cmd /k "cd C:\web_pages\Projects\roxana-server && npm start"

REM Wait for backend to initialize
timeout /t 5 /nobreak

REM Start the frontend with Vite
echo Starting frontend on port 5173 (proxying API requests to backend)...
cd C:\web_pages\Projects\roxana
npm run dev

echo Application is now running.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:3004/api
