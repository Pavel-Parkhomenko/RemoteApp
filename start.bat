@echo off
chcp 65001
title Запуск приложений

:: Переходим в папку со скриптом
cd /d "%~dp0"

:ASK
cls
echo =====================================
echo          REMOTE CONTROL v2
echo =====================================
echo.

echo ⚙️ Хотите выбрать координаты?
echo.
echo   [1] Да
echo   [2] Нет
echo   [3] Выход
echo.
set /p choice="Выберите опцию [1-3]: "

if "%choice%"=="1" goto RUN_GETPOS_WAIT
if "%choice%"=="2" goto SKIP_GETPOS
if "%choice%"=="3" exit /b

echo.
echo ⚠️ Неверный выбор! Попробуйте снова.
timeout /t 2 /nobreak >nul
goto ASK

:RUN_GETPOS_WAIT
echo.
echo Запуск GetPos.exe...

:: Проверяем существует ли файл
if not exist "GetPos.exe" (
    echo ❌ ОШИБКА: GetPos.exe не найден в папке %CD%!
    goto ERROR__
)

:: Запускаем и ждем закрытия
start "" /wait "GetPos.exe"
:: Этот код выполнится только после закрытия GetPos.exe
echo ✅ Координаты выбраны. Продолжаем выполнение...
echo.
goto CONTINUE

:SKIP_GETPOS
echo Используем уже существующие данные
goto CONTINUE

:CONTINUE
echo Запуск AutoHotkey скрипта...
if exist "operaGXscript.ahk" (
    start "" "operaGXscript.ahk"
    echo ✅ Успешно
) else (
    echo ❌ ОШИБКА: operaGXscript.ahk не найден!
    goto ERROR__
)

echo Запуск Node.js сервера...

if not exist "server.js" (
    echo ❌ ОШИБКА: server.js не найден!
    goto ERROR__
)
echo ✅ Успешно

echo ⚡ Нажмите Ctrl+C в этом окне для остановки сервера
echo Приложение доступно в вашем браузере по адресу:
node server.js

:ERROR__
echo ⚠️ Ошибка выполнения программы. Продолжение невозможно!
pause