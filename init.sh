#!/bin/zsh

echo "# Internet-Archive-download-util" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/PinkQween/Internet-Archive-download-util.git
git push -u origin main