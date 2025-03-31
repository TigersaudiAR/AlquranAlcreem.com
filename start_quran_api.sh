#!/bin/bash
cd quran_api && python -m uvicorn quran_api_main:app --host 0.0.0.0 --port 8000