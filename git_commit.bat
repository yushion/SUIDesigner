@echo off
chcp 65001 >nul
echo ===== Git Commit Script =====
echo.

REM Try to find git.exe
set "GIT="
for %%p in (
    "C:\Program Files\Git\bin\git.exe"
    "C:\Program Files (x86)\Git\bin\git.exe"
    "%LOCALAPPDATA%\Programs\Git\bin\git.exe"
    "D:\Program Files\Git\bin\git.exe"
) do (
    if exist %%p set "GIT=%%~p"
)

if "%GIT%"=="" (
    echo [ERROR] Git not found. Please install Git or add it to PATH.
    echo Download: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [INFO] Git found: %GIT%
echo [INFO] Working directory: %~dp0

cd /d "%~dp0"

REM Check if git repo exists
if not exist ".git" (
    echo [INFO] Initializing git repository...
    "%GIT%" init
    if errorlevel 1 (
        echo [ERROR] Git init failed.
        pause
        exit /b 1
    )
    echo [INFO] Git repository initialized.
)

REM Stage the file
echo [INFO] Staging: 架构分析文档.md
"%GIT%" add "架构分析文档.md"
if errorlevel 1 (
    echo [ERROR] Git add failed.
    pause
    exit /b 1
)

REM Commit
echo [INFO] Committing...
"%GIT%" commit -m "docs: 更新架构分析文档至 v10.1，修正与代码实际状态的不一致"

if errorlevel 1 (
    echo [WARN] Nothing to commit or commit failed.
    pause
    exit /b 0
)

echo.
echo ===== Commit Successful =====
echo.

REM Show remote info
echo [INFO] Remote repositories:
"%GIT%" remote -v

echo.
echo [INFO] To push to remote, run:
echo   git remote add origin ^<your-remote-url^>
echo   git push -u origin master
echo.
pause