@echo off

set "BUILD_DIR=..\build\"
set "BUILD_DIR_ART=artifacts\"

if "%1" == "build" goto build
if "%1" == "tar" goto zip
if "%1" == "zip" goto zip
if "%1" == "zip_all" goto zip_all
if "%1" == "clean" goto clean

goto eof

:clean

del "%BUILD_DIR%\*" /F /Q
for /d %%p in ("%BUILD_DIR%\*") do rd /Q /S "%%p"

goto eof

:build
echo ===============
echo Package name: %npm_package_name%
echo Electron version: %npm_package_config_electronVersion%
echo App version: %npm_package_version%
echo Product name: %npm_package_config_productName%
echo ===============

electron-packager ./ %npm_package_name% ^
  --platform=%npm_package_config_buildPlatform% ^
  --arch=%npm_package_config_buildArch% ^
  --electron-version=%npm_package_config_electronVersion% ^
  --no-tmpdir ^
  --out=%BUILD_DIR% ^
  --app-version="%npm_package_version%" ^
  --version-string.FileDescription="%npm_package_config_productName%" ^
  --version-string.ProductName="%npm_package_config_productName%" ^
  --icon=favicon.ico ^
  --overwrite

goto eof

:zip_all
echo Targets: %npm_package_config_zipTargets%
for %%i in (%npm_package_config_zipTargets%) do (
  for /F "delims=: tokens=1-3" %%a in ("%%i") do (
    call :zip %%c %%a %%b
  )
)

goto eof

:zip
set ZIP_NAME=%~2-%~3
set BUILD_NAME=%npm_package_name%-%ZIP_NAME%
set "BUILD_PATH=%BUILD_DIR%%BUILD_NAME%"

echo ===============
echo Zip name: %ZIP_NAME%
echo Zip type: %1
echo Build name: %BUILD_NAME%
echo Build path: %BUILD_PATH%
echo ===============

mkdir %BUILD_DIR% >nul 2>&1
pushd %BUILD_PATH%
echo Zip process started

setlocal EnableDelayedExpansion
if "%~1" == "tar" (
  set "FINAL_EXT=.tgz"
  del "..\%BUILD_DIR_ART%%BUILD_NAME%!FINAL_EXT!" >nul 2>&1
  7za a -ttar -so -snl "..\%BUILD_DIR_ART%%BUILD_NAME%.tar" . | 7za a -si "..\%BUILD_DIR_ART%%BUILD_NAME%!FINAL_EXT!" | find /I "ing"
) else (
  set "FINAL_EXT=.zip"
  del "..\%BUILD_DIR_ART%%BUILD_NAME%!FINAL_EXT!" >nul 2>&1
  7za a -tzip "..\%BUILD_DIR_ART%%BUILD_NAME%!FINAL_EXT!" . | find /I "ing"
)
pushd "..\%BUILD_DIR_ART%"
echo Hashing: %BUILD_NAME%!FINAL_EXT!
if not exist "SHA1SUMS.txt" copy /Y nul "SHA1SUMS.txt" >nul
for /F "delims=" %%a in ('certutil -hashfile "%BUILD_NAME%!FINAL_EXT!" sha1 ^| findstr /V :') do (
  echo %%a  %BUILD_NAME%!FINAL_EXT! >>"SHA1SUMS.txt"
)
endlocal

echo Zip process finished
echo ===============
popd
popd

exit /B 0

:eof
