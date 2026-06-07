Option Explicit
Dim shell, fso, folder, cmd
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
folder = fso.GetParentFolderName(WScript.ScriptFullName)
If Not fso.FileExists(fso.BuildPath(folder, "dist\index.html")) Then
  MsgBox "dist\index.html was not found. Extract the ZIP fully first.", vbCritical, "HealthBuddy AI"
  WScript.Quit
End If
cmd = "cmd.exe /c cd /d """ & folder & "\dist"" && (py -3 -m http.server 5500 --bind 127.0.0.1 || python -m http.server 5500 --bind 127.0.0.1)"
shell.Run cmd, 0, False
WScript.Sleep 1500
shell.Run "http://127.0.0.1:5500/", 1, False
