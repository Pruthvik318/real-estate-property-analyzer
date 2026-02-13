#!/bin/bash
echo "--- Starting Dependency Check ---"
pip install python-multipart
echo "--- Starting Uvicorn ---"
exec uvicorn main:app --host 0.0.0.0 --port 10000
