import pytest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if __name__ == "__main__":
    test_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tests", "backend_test.py")
    sys.exit(pytest.main(["-v", test_file]))
