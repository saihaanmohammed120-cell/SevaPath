import shutil
import os

path = r"E:\Sevapath\.emergent"
if os.path.exists(path):
    shutil.rmtree(path)
    print(f"Deleted {path}")
else:
    print(f"{path} does not exist")
