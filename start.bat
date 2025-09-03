@echo off
echo Запуск AutoHotkey скрипта...
start "" "D:\programs\RemoteApp\operaGXscript.ahk"

echo Запуск Node.js сервера...
cd /d D:\programs\RemoteApp\server.js
start "" cmd /k "node server.js"

echo Всё запущено!