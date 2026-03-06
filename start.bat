@echo off
chcp 65001
title Запуск приложений

:: Переходим в папку со скриптом
cd /d "%~dp0"

:ASK
cls
echo =================================================
echo               НАСТРОЙКА ЗАПУСКА
echo =================================================
echo.
echo Хотите запустить GetPos.exe?
echo.
echo   [1] Да (yes) - ждать закрытия GetPos
echo   [2] Нет (no)
echo   [3] Выход
echo.
set /p choice="Выберите опцию (1-3): "

if "%choice%"=="1" goto RUN_GETPOS_WAIT
if "%choice%"=="2" goto SKIP_GETPOS
if "%choice%"=="3" exit /b

echo.
echo Неверный выбор! Попробуйте снова.
timeout /t 2 /nobreak >nul
goto ASK

:RUN_GETPOS_WAIT
echo.
echo Запуск GetPos.exe...
echo.

:: Проверяем существует ли файл
if not exist "GetPos.exe" (
    echo ОШИБКА: GetPos.exe не найден в папке %CD%!
    echo.
    pause
    goto CONTINUE
)

:: Запускаем и ждем закрытия
start "" /wait "GetPos.exe"

:: Этот код выполнится только после закрытия GetPos.exe
echo.
echo GetPos.exe закрыт. Продолжаем выполнение...
echo.
pause
goto CONTINUE

:SKIP_GETPOS
echo.
echo GetPos.exe пропущен
goto CONTINUE

:CONTINUE
echo.
echo Запуск AutoHotkey скрипта...
if exist "operaGXscript.ahk" (
    start "" "operaGXscript.ahk"
) else (
    echo ОШИБКА: operaGXscript.ahk не найден!
)

echo.
echo Запуск Node.js сервера...

if not exist "server.js" (
    echo ОШИБКА: server.js не найден!
    echo.
    pause
    exit /b 1
)

echo Приложение доступно в вашем браузере по адресу:
node server.js

echo.
echo Нажмите Ctrl+C в этом окне для остановки сервера
echo.


echo.
echo Сервер остановлен.
pause