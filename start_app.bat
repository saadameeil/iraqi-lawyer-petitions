@echo off
title Iraqi Lawyer Petitions Server
echo ========================================================
echo   منصة تحرير وطباعة العرائض القضائية - المحامي سعد فراس أميل
echo ========================================================
echo.
echo Starting local server on http://localhost:8080 ...
cd /d "C:\Users\saad7\.gemini\antigravity\scratch\iraqi_lawyer_petitions"
start "" http://localhost:8080
python -m http.server 8080
