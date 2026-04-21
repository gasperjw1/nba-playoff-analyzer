#!/bin/bash
# Run this from the nba-playoff-analyzer folder after copying it to your GitHub directory
# Usage:
#   cp -r ~/path/to/nba-playoff-analyzer ~/Documents/GitHub/nba-playoff-analyzer
#   cd ~/Documents/GitHub/nba-playoff-analyzer
#   bash setup-repo.sh

set -e

# Clean up any sandbox git artifacts
rm -rf .git

# Initialize fresh repo
git init -b main
git add index.html CONTEXT.md .gitignore
git commit -m "Initial commit: NBA 2026 Playoff Analyzer

Single-file interactive HTML app analyzing all 8 first-round series with:
- Custom statistical model calibrated against 2025 playoffs (73.5% accuracy)
- Interactive scenario builder with player toggles
- SPM Chemistry Engine, round-adjusted HCA, system coherence bonuses
- Comprehensive betting analysis for all 8 series (Game 1 & Game 2)
- Model Learnings and Definitions pages
- Verified box scores for 4 completed Game 1s (April 18, 2026)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# Create GitHub repo and push
gh repo create nba-playoff-analyzer --public --source=. --remote=origin --push

echo ""
echo "Done! Repo created and pushed to GitHub."
echo "Delete this script if you like: rm setup-repo.sh"
