@echo off

set "BUILD_DIR=..\build\"

if "%1" == "build" goto build
if "%1" == "tar" goto zip
if "%1" == "zip" goto zip
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
  --out=../build ^
  --app-version="%npm_package_version%" ^
  --version-string.FileDescription="%npm_package_config_productName%" ^
  --version-string.ProductName="%npm_package_config_productName%" ^
  --icon=favicon.ico ^
  --overwrite

goto eof

:zip
set ZIP_NAME=%~2
set BUILD_NAME=%npm_package_name%-%ZIP_NAME%-x64
set "BUILD_PATH=%BUILD_DIR%%BUILD_NAME%"

echo ===============
echo Zip name: %ZIP_NAME%
echo Zip type: %1
echo Build name: %BUILD_NAME%
echo Build path: %BUILD_PATH%
echo ===============

mkdir %BUILD_DIR% >nul 2>&1
cd %BUILD_PATH%

echo Zip process started

if "%1" == "tar" (
  del "%BUILD_DIR%%BUILD_NAME%.tgz" >nul 2>&1
  7za a -ttar -so -snl "%BUILD_DIR%%BUILD_NAME%.tar" . | 7za a -si "%BUILD_DIR%%BUILD_NAME%.tgz" | find /I "ing"
) else (
  del "%BUILD_DIR%%BUILD_NAME%.zip" >nul 2>&1
  7za a -tzip "%BUILD_DIR%%BUILD_NAME%.zip" . | find /I "ing"
)

echo Zip process finished
echo ===============

goto eof

:eof
