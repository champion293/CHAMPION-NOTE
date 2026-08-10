#!/bin/bash
set -e

git init
git add .
git commit -m "Initial commit - My Notes / CHAMPION NOTE by Abdul Mateen"
git branch -M main
git remote add origin https://github.com/champion293/CHAMPION-NOTE.git
git push -u origin main
