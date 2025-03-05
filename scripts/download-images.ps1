# Image download and processing script
$ErrorActionPreference = "Stop"

# Define the image URLs and their destinations
$imageMap = @{
    "services/bookkeeping.webp" = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&w=1920&q=80&fm=webp"
    "services/payroll.webp" = "https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&w=1920&q=80&fm=webp"
    "services/tax.webp" = "https://images.unsplash.com/photo-1554224154-22dec7ec8818?ixlib=rb-4.0.3&w=1920&q=80&fm=webp"
    "services/federal.webp" = "https://images.unsplash.com/photo-1636207543865-acf3ad382295?ixlib=rb-4.0.3&w=1920&q=80&fm=webp"
    "services/startup.webp" = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&w=1920&q=80&fm=webp"
    "services/audit.webp" = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&w=1920&q=80&fm=webp"
    "features/quality.webp" = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&w=1920&q=80&fm=webp"
    "features/affordable.webp" = "https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-4.0.3&w=1920&q=80&fm=webp"
    "features/security.webp" = "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&w=1920&q=80&fm=webp"
}

# Create directories if they don't exist
$publicPath = Join-Path $PSScriptRoot "..\public"
$imagesPath = Join-Path $publicPath "images"
$servicesPath = Join-Path $imagesPath "services"
$featuresPath = Join-Path $imagesPath "features"

@($publicPath, $imagesPath, $servicesPath, $featuresPath) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force
        Write-Host "Created directory: $_"
    }
}

# Download and save images
foreach ($image in $imageMap.GetEnumerator()) {
    $destination = Join-Path $imagesPath $image.Key
    Write-Host "Downloading image for $($image.Key)..."
    
    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "Mozilla/5.0")
        $webClient.DownloadFile($image.Value, $destination)
        Write-Host "Successfully downloaded: $($image.Key)" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to download $($image.Key): $_" -ForegroundColor Red
    }
    finally {
        if ($webClient) {
            $webClient.Dispose()
        }
    }
    
    # Add a small delay between downloads
    Start-Sleep -Milliseconds 500
}

Write-Host "`nImage download complete!" -ForegroundColor Green
Write-Host "Images have been saved to: $imagesPath"
