#!/bin/bash
set -e

echo "Installing Node dependencies..."
npm install

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Build complete!"
