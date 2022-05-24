@echo off

start cmd.exe @cmd /k "cd server & yarn start"

cd client
echo %cd%
npm start

pause