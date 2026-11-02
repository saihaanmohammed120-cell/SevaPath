@echo off
echo ========================================================
echo SEVAPATH NATIVE FIREFOX QA MATRIX EXECUTION
echo ========================================================
cd E:\Sevapath\qa
echo 1. Run Smoke Test
echo 2. Run Services (11x6 Matrix)
echo 3. Run Eligibility Logic
echo 4. Run UI and Localization
echo 5. Run Resilience and Navigation
echo 6. Run All Tests
echo ========================================================
set /p choice="Select an option (1-6): "

if "%choice%"=="1" call npm.cmd run test:smoke
if "%choice%"=="2" call npm.cmd run test:services
if "%choice%"=="3" call npm.cmd run test:eligibility
if "%choice%"=="4" call npm.cmd run test:ui
if "%choice%"=="5" call npm.cmd run test:resilience
if "%choice%"=="6" call npm.cmd run test:all

pause
