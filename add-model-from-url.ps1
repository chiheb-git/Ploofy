# ============================================
# Script: add-model-from-url.ps1
# Usage: .\add-model-from-url.ps1 -url "https://..." -nom "burger-viande"
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$url,
    
    [Parameter(Mandatory=$true)]
    [string]$nom
)

$nomClean = $nom.ToLower().Trim() -replace '\s+', '-' -replace '[^a-z0-9-]', ''
$downloads = "C:\Users\B InfoSoft\Downloads"
$models = "D:\Proget_QR-code\projet (1)\artifacts\customer\public\models"
$project = "D:\Proget_QR-code\projet (1)"
$baseUrl = "https://restaurant-qr-customer-drab.vercel.app/models"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  AJOUT MODELE 3D: $nomClean" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Etape 1 â€” Telecharger le GLB depuis l'URL
Write-Host ""
Write-Host "[1/4] Telechargement du fichier GLB..." -ForegroundColor Yellow
$tempFile = "$downloads\$nomClean-original.glb"

try {
    Invoke-WebRequest -Uri $url -OutFile $tempFile
    $sizeMB = [math]::Round((Get-Item $tempFile).Length/1MB, 2)
    Write-Host "      Telecharge: $nomClean-original.glb ($sizeMB MB)" -ForegroundColor Green
} catch {
    Write-Host "ERREUR: Impossible de telecharger le fichier" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit
}

# Etape 2 â€” Compresser
Write-Host ""
Write-Host "[2/4] Compression..." -ForegroundColor Yellow
$outputFile = "$downloads\$nomClean.glb"

try {
    gltf-transform optimize $tempFile $outputFile --compress draco 2>&1
    
    if (Test-Path $outputFile) {
        $sizeFinal = [math]::Round((Get-Item $outputFile).Length/1MB, 2)
        Write-Host "      Compresse: $nomClean.glb ($sizeFinal MB)" -ForegroundColor Green
    } else {
        # Si compression echoue, utiliser l'original
        Copy-Item $tempFile $outputFile
        Write-Host "      Compression ignoree, fichier original utilise" -ForegroundColor Yellow
    }
} catch {
    Copy-Item $tempFile $outputFile
    Write-Host "      Compression ignoree, fichier original utilise" -ForegroundColor Yellow
}

# Etape 3 â€” Copier dans le projet et push GitHub
Write-Host ""
Write-Host "[3/4] Push sur GitHub..." -ForegroundColor Yellow

Copy-Item $outputFile "$models\$nomClean.glb" -Force

Set-Location $project
git add -f "artifacts\customer\public\models\$nomClean.glb"
git commit -m "add $nomClean 3D model"
git push

Write-Host "      Pousse sur GitHub" -ForegroundColor Green

# Etape 4 â€” Resultat final
$finalUrl = "$baseUrl/$nomClean.glb"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  TERMINE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL A COLLER DANS L'ADMIN:" -ForegroundColor White
Write-Host ""
Write-Host "  $finalUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Attendez 2 minutes que Vercel deploie." -ForegroundColor Gray
Write-Host ""

# Copier l'URL dans le presse-papier
$finalUrl | Set-Clipboard
Write-Host "L'URL a ete copiee dans le presse-papier!" -ForegroundColor Cyan
