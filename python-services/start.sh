#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)
export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
