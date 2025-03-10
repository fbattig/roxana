@echo off
echo Starting Roxana Application...

REM Connect to ASP.NET Core Web API
echo Connecting to ASP.NET Core Web API at https://localhost:7082...

REM Start the frontend with Vite
echo Starting frontend on port 5173 (connecting to ASP.NET Core Web API)...
cd C:\web_pages\Projects\roxana
npm run dev

echo Application is now running.
echo Frontend: http://localhost:5173
echo Backend API: https://localhost:7082
