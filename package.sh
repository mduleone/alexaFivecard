#!/bin/bash

zip -r skill.zip -x "*.png" "*.git*" "*.md" "*.txt" "*.log" ".DS_Store" "package.*" -u .
