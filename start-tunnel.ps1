Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  INSIDER THREAT RADAR - LOCAL BACKEND TUNNEL LAUNCHER  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$port = 8080
$client = New-Object System.Net.Sockets.TcpClient
try {
    $client.Connect("127.0.0.1", $port)
    Write-Host "[SUCCESS] Spring Boot backend detected on port $port!" -ForegroundColor Green
    $client.Close()
} catch {
    Write-Host "[NOTICE] Spring Boot backend is not running on port $port yet." -ForegroundColor Yellow
    Write-Host "Remember to run 'cd backend && mvn spring-boot:run' in another window." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting secure HTTPS tunnel via npx localtunnel..." -ForegroundColor Cyan
Write-Host "Keep this window OPEN while presenting or testing!" -ForegroundColor DarkGray
Write-Host ""
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "Once the url appears below (e.g. https://...loca.lt):"
Write-Host "1. Copy the https://... URL"
Write-Host "2. Open https://codewithpriyam.github.io"
Write-Host "3. Click the '⚙ TUNNEL' button in the header"
Write-Host "4. Paste your URL and click 'TEST & CONNECT'!"
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

npx -y localtunnel --port $port

