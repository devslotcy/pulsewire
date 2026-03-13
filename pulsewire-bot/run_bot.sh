#!/bin/bash

# PulseWire Bot Runner
# Runs every 45 minutes via cron

cd /Users/dev/development/enews/pulsewire-bot
source venv/bin/activate
python main.py
