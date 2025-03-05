# PowerShell script to download service images

# Create directory if it doesn't exist
$imagesDir = ".\public\images\services"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force
}

# Financial Statement Preparation image
$financialStatementUrl = "https://img.freepik.com/free-photo/accounting-planning-budget-business-finance-concept_53876-133697.jpg"
$financialStatementPath = "$imagesDir\financial-statement.webp"
Invoke-WebRequest -Uri $financialStatementUrl -OutFile $financialStatementPath

# Business Valuation image
$businessValuationUrl = "https://img.freepik.com/free-photo/business-valuation-concept-with-wooden-blocks-with-icons-it_176474-10498.jpg"
$businessValuationPath = "$imagesDir\business-valuation.webp"
Invoke-WebRequest -Uri $businessValuationUrl -OutFile $businessValuationPath

# Cash Flow Management image
$cashFlowUrl = "https://img.freepik.com/free-photo/cash-flow-statement-financial-concept_53876-133694.jpg"
$cashFlowPath = "$imagesDir\cash-flow.webp"
Invoke-WebRequest -Uri $cashFlowUrl -OutFile $cashFlowPath

Write-Host "Images downloaded successfully!"
