@echo off
SET "file=c:\work-bench-2025\web-ui\work-ifence-web-ui-a19\src\app\pages\static\about-us-page\about-us-page.component.scss"
SET "tempfile=%file%.temp"

powershell -Command "(Get-Content -Raw '%file%') -replace '\.about-us-area\.dark-about-us-area \.navigation-buttons \.nav-button \{\r\n  background-color: rgba\(var\(--primaryColor-rgb, 124, 58, 237\), 0\.2\);\r\n  color: var\(--primaryColor, #7c3aed\);\r\n\}', '.about-us-area.dark-about-us-area .navigation-buttons .nav-button {\r\n  color: var(--mainColor, #4353ff);\r\n}'" | Set-Content '%tempfile%'

if exist "%tempfile%" (
    move /y "%tempfile%" "%file%"
    echo Updated navigation styles successfully.
) else (
    echo Failed to update styles.
)