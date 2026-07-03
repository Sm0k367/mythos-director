# Mythos Director — full deploy bootstrap
# Uses git credential manager for GitHub API; polls for Vercel CLI auth.

param(
    [string]$OpenAIKey = $env:OPENAI_API_KEY,
    [string]$HfToken = $env:HF_TOKEN,
    [int]$AuthWaitSeconds = 180
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

function Get-GitHubToken {
    $lines = "protocol=https`nhost=github.com`n" | git credential fill
    $map = @{}
    foreach ($line in $lines) {
        if ($line -match '^([^=]+)=(.*)$') { $map[$matches[1]] = $matches[2] }
    }
    if (-not $map.password) { throw "No GitHub token in credential manager. Sign in to GitHub in VS Code or run: git credential fill" }
    return $map.password
}

function Get-VercelToken {
    $authPath = Join-Path $env:APPDATA "com.vercel.cli\Data\auth.json"
    if (-not (Test-Path $authPath)) { return $null }
    $auth = Get-Content $authPath -Raw | ConvertFrom-Json
    if ($auth.token) { return $auth.token }
    return $null
}

function Read-LocalEnvKey {
    param([string]$Key)
    $paths = @(
        (Join-Path $env:USERPROFILE "smoken-tokens\.env"),
        (Join-Path $Root "apps\web\.env.local"),
        (Join-Path $Root ".env.local")
    )
    foreach ($path in $paths) {
        if (-not (Test-Path $path)) { continue }
        foreach ($line in Get-Content $path) {
            if ($line -match "^\s*$Key\s*=\s*(.+)\s*$") {
                return $matches[1].Trim().Trim('"').Trim("'")
            }
        }
    }
    return $null
}

Write-Host "==> Secret scan"
node scripts/check-no-secrets.mjs

if (-not $OpenAIKey) { $OpenAIKey = Read-LocalEnvKey "OPENAI_API_KEY" }
if (-not $HfToken) { $HfToken = Read-LocalEnvKey "HF_TOKEN" }

$vercelToken = Get-VercelToken
if (-not $vercelToken) {
    Write-Host "==> Vercel not authenticated. Open this URL in your browser (logged into Vercel/GitHub):"
    Write-Host "    https://vercel.com/api/registration/login-with-github?mode=login&next=https%3A%2F%2Fvercel.com%2Fnotifications%2Fcli-login-oob"
    Write-Host "    Waiting up to $AuthWaitSeconds seconds for CLI auth..."
    $deadline = (Get-Date).AddSeconds($AuthWaitSeconds)
    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Seconds 5
        $vercelToken = Get-VercelToken
        if ($vercelToken) {
            Write-Host "==> Vercel CLI authenticated."
            break
        }
    }
}

if (-not $vercelToken) {
    Write-Host "==> Run: vercel login --github --oob"
    Write-Host "    Then re-run: pwsh scripts/complete-setup.ps1"
    exit 1
}

Write-Host "==> Linking Vercel project"
$env:VERCEL_TOKEN = $vercelToken
vercel link --yes --project mythos-director 2>$null
if ($LASTEXITCODE -ne 0) {
    vercel link --yes 2>$null
}

Write-Host "==> Setting Vercel environment variables"
if ($OpenAIKey) {
    echo $OpenAIKey | vercel env add OPENAI_API_KEY production --yes 2>$null
    echo $OpenAIKey | vercel env add OPENAI_API_KEY preview --yes 2>$null
}
if ($HfToken) {
    echo $HfToken | vercel env add HF_TOKEN production --yes 2>$null
}

Write-Host "==> Deploying to production"
vercel deploy --prod --yes --token $vercelToken
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$projectJson = Join-Path $Root ".vercel\project.json"
if (Test-Path $projectJson) {
    $project = Get-Content $projectJson -Raw | ConvertFrom-Json
    Write-Host "==> Syncing GitHub Actions secrets"
    $args = @("VERCEL_TOKEN=$vercelToken")
    if ($project.orgId) { $args += "VERCEL_ORG_ID=$($project.orgId)" }
    if ($project.projectId) { $args += "VERCEL_PROJECT_ID=$($project.projectId)" }
    node scripts/set-github-secrets.mjs @args
    Write-Host "==> GitHub secrets configured."
}

Write-Host "==> Done. Production URL above."