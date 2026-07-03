"""
Production Git Review + Worktree Engine for Mythos Director

Every agent-proposed code change runs in an isolated worktree.
Human must approve the diff before merge. Never auto-merge.
"""

import subprocess
import tempfile
import os
from typing import Dict, Any
from pathlib import Path

class GitReviewEngine:
    def __init__(self, base_repo: str = "."):
        self.base_repo = Path(base_repo).resolve()

    def create_worktree(self, branch: str) -> Path:
        """Create an isolated worktree for the agent session."""
        worktree_dir = Path(tempfile.mkdtemp(prefix="mythos-worktree-"))
        subprocess.run(
            ["git", "worktree", "add", str(worktree_dir), branch],
            cwd=self.base_repo,
            check=True
        )
        return worktree_dir

    def propose_change(self, worktree: Path, files: Dict[str, str]) -> Dict[str, Any]:
        """Agent writes files, we generate the diff."""
        for path, content in files.items():
            (worktree / path).parent.mkdir(parents=True, exist_ok=True)
            (worktree / path).write_text(content)

        result = subprocess.run(
            ["git", "diff", "--cached", "--no-color"],
            cwd=worktree,
            capture_output=True,
            text=True
        )
        return {
            "status": "review_required",
            "diff": result.stdout,
            "worktree": str(worktree)
        }

    def approve_and_merge(self, worktree: Path, branch: str) -> Dict[str, Any]:
        """Human approved — merge the worktree."""
        subprocess.run(["git", "add", "."], cwd=worktree, check=True)
        subprocess.run(["git", "commit", "-m", "Agent change approved"], cwd=worktree, check=True)
        subprocess.run(["git", "worktree", "remove", str(worktree)], check=True)
        return {"status": "merged", "branch": branch}

    def reject(self, worktree: Path):
        """Human rejected — discard worktree."""
        subprocess.run(["git", "worktree", "remove", str(worktree)], check=True)
        return {"status": "rejected"}
