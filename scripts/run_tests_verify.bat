@echo off
cd E:\Sevapath\backend
python -m pytest tests\backend_test.py -v
cd E:\Sevapath
python check_sevapath.py
