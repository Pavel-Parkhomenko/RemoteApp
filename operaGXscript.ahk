#Requires AutoHotkey v2.0

Loop {
    command := ""
    operaWin := "ahk_exe opera.exe"
    
    if FileExist("command.txt") {
        command := Trim(FileRead("command.txt"))
    }
    else {
        Sleep(1000)
        continue
    }

    if command == "pause" {
        WinActivate(operaWin)
        Send("{Space}")
    }
    else if command == "next" {
        WinActivate(operaWin)
        Send("{Media_Next}")
    }
    else if command == "previous" {
        WinActivate(operaWin)
        Send("{Media_Prev}")
        Sleep(100)
        Send("{Media_Prev}")
    }
    else if command == "next-movie" {
        WinActivate(operaWin)
        Send("{Space}")
        Sleep(500)

        coords := Trim(FileRead("coords.txt"))
        coordArray := StrSplit(coords, ",")

        x := coordArray[1]
        y := coordArray[2]

        Click(x, y)
        Sleep(300)
        MouseMove(0, 100, 0, "R")
    }
    else if command == "prev-movie" {
        WinActivate(operaWin)
        Send("{Space}")
        Sleep(500)

        coords := Trim(FileRead("coords.txt"))
        coordArray := StrSplit(coords, ",")

        x := coordArray[3]
        y := coordArray[4]

        Click(x, y)
        Sleep(300)
        MouseMove(0, 100, 0, "R")
    }
    else if command == "volume-up" {
        SoundSetVolume("+5")
    }
    else if command == "volume-down" {
        SoundSetVolume("-5")
    }
    else if command == "rewind-right" {
        WinActivate(operaWin)
        Send("{Right}")
    }
    else if command == "rewind-left" {
        WinActivate(operaWin)
        Send("{Left}")
    }

    if FileExist("command.txt") {
        FileDelete("command.txt")
    }

    Sleep(1000)
}
