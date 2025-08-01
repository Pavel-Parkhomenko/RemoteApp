#Persistent
SetTitleMatchMode, 2

Loop {
    FileRead, command, command.txt
    if (command = "pause") {
        WinActivate, Opera GX
        Send, {Space}
        FileDelete, command.txt
    }
    if (command = "next") {
        WinActivate, Opera GX
        Send, {Media_Next}
        FileDelete, command.txt
    }
    if (command = "previous") {
        WinActivate, Opera GX
        Send, {Media_Prev}
        FileDelete, command.txt
    }
    if (command = "next-movie") {
        WinActivate, Opera GX
        Send, {Space}
        Sleep, 500
        Click, 127, 1044
        FileDelete, command.txt
    }
    Sleep, 1000
}