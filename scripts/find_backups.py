import os
import glob

def find_files():
    results = []
    for root, dirs, files in os.walk(r"E:\Sevapath"):
        for file in files:
            if file.endswith('.bak') or 'backup' in file.lower() or 'old' in file.lower() or 'history' in file.lower():
                results.append(os.path.join(root, file))
    with open("found_backups.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(results))
find_files()
