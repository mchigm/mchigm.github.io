# Sync script for source-MCHIGM bidirectional synchronization
# This script syncs between the embedded source-MCHIGM folder and a separate Git repository

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("pull", "push", "status")]
    [string]$Action = "status",
    
    [Parameter(Mandatory=$false)]
    [string]$SourceRepoPath = "e:\Pjt\Programming\source-MCHIGM"
)

$EmbeddedPath = "Folders\Files\files\simple forum\source-MCHIGM"
$ScriptDir = $PSScriptRoot

# Color output functions
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

# Check if source repo exists
if (-not (Test-Path $SourceRepoPath)) {
    Write-Warning "Source repository not found at: $SourceRepoPath"
    $create = Read-Host "Would you like to clone it now? (y/n)"
    
    if ($create -eq 'y') {
        Write-Info "Cloning source-MCHIGM repository..."
        $parentDir = Split-Path $SourceRepoPath -Parent
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }
        git clone https://github.com/mchigm/source-MCHIGM.git $SourceRepoPath
        
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to clone repository"
            exit 1
        }
        Write-Success "Repository cloned successfully"
    } else {
        Write-Error "Cannot proceed without source repository"
        exit 1
    }
}

Set-Location $ScriptDir

switch ($Action) {
    "status" {
        Write-Info "`n=== Source Repository Status ==="
        Push-Location $SourceRepoPath
        git status
        Pop-Location
        
        Write-Info "`n=== Embedded Folder Comparison ==="
        $sourceFiles = Get-ChildItem -Path $SourceRepoPath -Recurse -File -Exclude ".git" | 
            Select-Object -ExpandProperty FullName | 
            ForEach-Object { $_.Substring($SourceRepoPath.Length + 1) }
        
        $embeddedFiles = Get-ChildItem -Path $EmbeddedPath -Recurse -File | 
            Select-Object -ExpandProperty FullName | 
            ForEach-Object { $_.Substring((Join-Path $ScriptDir $EmbeddedPath).Length + 1) }
        
        $onlyInSource = $sourceFiles | Where-Object { $embeddedFiles -notcontains $_ }
        $onlyInEmbedded = $embeddedFiles | Where-Object { $sourceFiles -notcontains $_ }
        
        if ($onlyInSource) {
            Write-Warning "`nFiles only in source repo:"
            $onlyInSource | ForEach-Object { Write-Host "  - $_" }
        }
        
        if ($onlyInEmbedded) {
            Write-Warning "`nFiles only in embedded folder:"
            $onlyInEmbedded | ForEach-Object { Write-Host "  - $_" }
        }
        
        if (-not $onlyInSource -and -not $onlyInEmbedded) {
            Write-Success "`nFile lists match!"
        }
    }
    
    "pull" {
        Write-Info "Pulling updates from source repository..."
        
        # Update source repo
        Push-Location $SourceRepoPath
        git pull origin main
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to pull from remote"
            Pop-Location
            exit 1
        }
        Pop-Location
        
        # Source Protection: Check for diverged files
        Write-Info "Checking for source protection (diverged files)..."
        
        $protectedFiles = @()
        $newFiles = @()
        $updateableFiles = @()
        
        Get-ChildItem -Path $SourceRepoPath -Recurse -File | 
            Where-Object { $_.FullName -notmatch "\.git" } | 
            ForEach-Object {
                $relativePath = $_.FullName.Substring($SourceRepoPath.Length + 1)
                $embeddedFilePath = Join-Path (Join-Path $ScriptDir $EmbeddedPath) $relativePath
                $sourceFilePath = $_.FullName
                
                if (-not (Test-Path $embeddedFilePath)) {
                    # New file - safe to add
                    $newFiles += $relativePath
                } else {
                    # File exists - check if it matches any version in source history
                    $embeddedHash = (Get-FileHash $embeddedFilePath -Algorithm SHA256).Hash
                    $sourceHash = (Get-FileHash $sourceFilePath -Algorithm SHA256).Hash
                    
                    if ($embeddedHash -eq $sourceHash) {
                        # Files are identical - skip
                        return
                    }
                    
                    # Check if embedded file exists in git history
                    Push-Location $SourceRepoPath
                    $gitPath = $relativePath -replace '\\', '/'
                    
                    # Get all historical hashes for this file
                    $historicalHashes = git log --all --pretty=format:"%H" -- $gitPath | 
                        ForEach-Object {
                            $commit = $_
                            try {
                                $content = git show "${commit}:${gitPath}" 2>$null
                                if ($content) {
                                    $tempFile = [System.IO.Path]::GetTempFileName()
                                    $content | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline
                                    $hash = (Get-FileHash $tempFile -Algorithm SHA256).Hash
                                    Remove-Item $tempFile -Force
                                    $hash
                                }
                            } catch {
                                # Ignore errors for deleted files
                            }
                        }
                    
                    Pop-Location
                    
                    if ($historicalHashes -contains $embeddedHash) {
                        # File matches a historical version - safe to update
                        $updateableFiles += $relativePath
                    } else {
                        # File has diverged - PROTECTED
                        $protectedFiles += $relativePath
                    }
                }
            }
        
        # Display protection report
        if ($protectedFiles.Count -gt 0) {
            Write-Warning "`n=== PROTECTED FILES (diverged from source history) ==="
            Write-Warning "These files will NOT be updated:"
            $protectedFiles | ForEach-Object { Write-Host "  🔒 $_" -ForegroundColor Yellow }
        }
        
        if ($newFiles.Count -gt 0) {
            Write-Info "`n=== NEW FILES (will be added) ==="
            $newFiles | ForEach-Object { Write-Host "  ✨ $_" -ForegroundColor Green }
        }
        
        if ($updateableFiles.Count -gt 0) {
            Write-Info "`n=== UPDATEABLE FILES (match source history) ==="
            $updateableFiles | ForEach-Object { Write-Host "  ✓ $_" -ForegroundColor Cyan }
        }
        
        # Confirm before proceeding
        Write-Host ""
        $confirm = Read-Host "Proceed with sync? (y/n)"
        if ($confirm -ne 'y') {
            Write-Info "Sync cancelled"
            return
        }
        
        # Sync to embedded folder
        Write-Info "`nSyncing to embedded folder..."
        
        $syncCount = 0
        
        # Copy new and updateable files only
        Get-ChildItem -Path $SourceRepoPath -Recurse -File | 
            Where-Object { $_.FullName -notmatch "\.git" } | 
            ForEach-Object {
                $relativePath = $_.FullName.Substring($SourceRepoPath.Length + 1)
                
                # Skip protected files
                if ($protectedFiles -contains $relativePath) {
                    return
                }
                
                $targetPath = Join-Path $EmbeddedPath $relativePath
                $targetDir = Split-Path $targetPath -Parent
                
                if (-not (Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                
                Copy-Item $_.FullName $targetPath -Force
                $syncCount++
            }
        
        Write-Success "`nPull completed successfully!"
        Write-Info "Synced $syncCount files ($($newFiles.Count) new, $($updateableFiles.Count) updated, $($protectedFiles.Count) protected)"
        Write-Info "Don't forget to commit changes in the main repository"
    }
    
    "push" {
        Write-Info "Pushing changes to source repository..."
        
        # Sync from embedded to source repo
        Write-Info "Syncing from embedded folder..."
        
        # Copy changed files
        Get-ChildItem -Path $EmbeddedPath -Recurse -File | 
            Where-Object { $_.FullName -notmatch "\.git" -and $_.FullName -notmatch "\.github" } | 
            ForEach-Object {
                $relativePath = $_.FullName.Substring((Join-Path $ScriptDir $EmbeddedPath).Length + 1)
                $targetPath = Join-Path $SourceRepoPath $relativePath
                $targetDir = Split-Path $targetPath -Parent
                
                if (-not (Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                
                Copy-Item $_.FullName $targetPath -Force
            }
        
        # Commit and push
        Push-Location $SourceRepoPath
        
        git add -A
        $status = git status --porcelain
        
        if ($status) {
            Write-Info "`nChanges to be committed:"
            git status --short
            
            $commitMsg = Read-Host "`nEnter commit message"
            if ([string]::IsNullOrWhiteSpace($commitMsg)) {
                $commitMsg = "Sync from main repository $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
            }
            
            git commit -m $commitMsg
            
            $pushConfirm = Read-Host "Push to remote? (y/n)"
            if ($pushConfirm -eq 'y') {
                git push origin main
                if ($LASTEXITCODE -eq 0) {
                    Write-Success "Push completed successfully!"
                } else {
                    Write-Error "Failed to push to remote"
                    Pop-Location
                    exit 1
                }
            } else {
                Write-Info "Changes committed locally but not pushed"
            }
        } else {
            Write-Info "No changes to commit"
        }
        
        Pop-Location
    }
}

Write-Info "`n=== Sync Complete ==="
