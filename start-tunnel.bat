@echo off
title SOC Radar - Local Backend HTTPS Tunnel
cls
echo ========================================================
echo   INSIDER THREAT RADAR - LOCAL BACKEND TUNNEL LAUNCHER
echo ========================================================
echo.
echo Checking if your Spring Boot backend is active on port 8080...
echo.

powershell -Command "$client = New-Object System.Net.Sockets.TcpClient; try { $client.Connect('127.0.0.1', 8080); Write-Host '[SUCCESS] Spring Boot backend detected on port 8080!' -ForegroundColor Green; $client.Close(); exit 0 } catch { Write-Host '[NOTICE] Spring Boot is not detected on port 8080 yet.' -ForegroundColor Yellow; Write-Host 'Remember to run `cd backend && mvn spring-boot:run` in another window.' -ForegroundColor Yellow; exit 0 }"

echo.
echo Starting secure HTTPS tunnel for port 8080...
echo Keep this terminal window OPEN while presenting/testing!
echo.
echo ========================================================
echo Once the url appears below (e.g. https://...loca.lt):
echo 1. Copy the https://... URL.
echo 2. Open https://codewithpriyam.github.io
echo 3. Click the '⚙ TUNNEL' button in the top-right header.
echo 4. Paste the URL and click 'TEST & CONNECT'!
echo ========================================================
echo.

npx -y localtunnel --port 8080
pause

