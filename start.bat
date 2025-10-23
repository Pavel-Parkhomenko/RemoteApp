@echo off
chcp 65001
echo Запуск AutoHotkey скрипта...
start "" "D:\GIT\RemoteApp\operaGXscript.ahk"

echo Запуск Node.js сервера...
cd /d D:\GIT\RemoteApp
echo Приложение доступно в вашем браузере по адресу:
node server.js

echo Сервер остановлен
pause