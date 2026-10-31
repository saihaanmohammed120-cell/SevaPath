import subprocess
import sys

def run():
    print("Running tests...")
    try:
        result = subprocess.run([sys.executable, "-m", "pytest", "backend/tests/"], capture_output=True, text=True)
        print("STDOUT:")
        print(result.stdout)
        print("STDERR:")
        print(result.stderr)
        print(f"Return code: {result.returncode}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run()
