#Persistent
SetTitleMatchMode, 2

Loop {
    FileRead, command, command.txt
    if (command = "pause") {
        WinActivate, Opera GX
        Send, {Space}
        FileDelete, command.txt
    }
    else if (command = "next") {
        WinActivate, Opera GX
        Send, {Media_Next}
        FileDelete, command.txt
    }
    else if (command = "previous") {
        WinActivate, Opera GX
        Send, {Media_Prev}
        FileDelete, command.txt
    }
    else if (command = "next-movie") {
        WinActivate, Opera GX
        Send, {Space}
        Sleep, 500
        Click, 127, 1044
        FileDelete, command.txt
    }
    else if (command = "prev-movie") {
        WinActivate, Opera GX
        Send, {Space}
        Sleep, 500
        Click, 90, 1044
        FileDelete, command.txt
    }
    else if (command = "volume-up") {
        SoundSet,+5
        FileDelete, command.txt
    }
    else if (command = "volume-down") {
        SoundSet,-5
        FileDelete, command.txt
    }
    else if (command = "rewind-right") {
        WinActivate, Opera GX
        Send, {Right}
        FileDelete, command.txt
    }
    else if (command = "rewind-left") {
        WinActivate, Opera GX
        Send, {Left}
        FileDelete, command.txt
    }
    Sleep, 1000
}