#Persistent
SetTitleMatchMode, 2

Loop {
    FileRead, command, command.txt
    if (command = "pause") {
        WinActivate, Opera GX
        Send, {Space}
    }
    else if (command = "next") {
        WinActivate, Opera GX
        Send, {Media_Next}
    }
    else if (command = "previous") {
        WinActivate, Opera GX
        Send, {Media_Prev}
    }

    else if (command = "next-movie") {
        WinActivate, Opera GX
        Send, {Space}
        Sleep, 500

        FileRead, coords, coords.txt
        StringSplit, coordArray, coords, `,

        x := coordArray1
        y := coordArray2

        Click, %x%, %y%
    }
    
    else if (command = "prev-movie") {
        WinActivate, Opera GX
        Send, {Space}
        Sleep, 500

        FileRead, coords, coords.txt
        StringSplit, coordArray, coords, `,

        x := coordArray3
        y := coordArray4

        Click, %x%, %y%
    }

    else if (command = "volume-up") {
        SoundSet,+5
    }
    else if (command = "volume-down") {
        SoundSet,-5
    }
    else if (command = "rewind-right") {
        WinActivate, Opera GX
        Send, {Right}
    }
    else if (command = "rewind-left") {
        WinActivate, Opera GX
        Send, {Left}
    }
    Sleep, 1000
}