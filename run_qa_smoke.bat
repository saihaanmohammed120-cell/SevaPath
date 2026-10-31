@echo off
cd E:\Sevapath\qa
call npm.cmd install
call npm.cmd run test:smoke
pause
