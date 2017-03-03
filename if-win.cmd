:: todo: filter out npm-windows-upgrade, hidden directories, and first line where it echos the thing for some reason
@echo off
set list="for /F ""skip^=1"" %%p in ('npm root -g') do dir /b /d %%p"
FOR /F "skip=1" %%A IN (
  ' %list% '
) DO (
  echo %%A
)
