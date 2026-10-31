import subprocess
with open("git_history.txt", "wb") as f:
    f.write(subprocess.check_output(["git", "log", "-p", "backend/services/verified.py"]))
with open("git_history_registry.txt", "wb") as f:
    f.write(subprocess.check_output(["git", "log", "-p", "backend/services/registry.py"]))
