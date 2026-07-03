"""
Self-Development Maintainer Agent for Mythos Director

Opt-in agent that can read/edit/test/fix Mythos Director's own source.
All changes go through Git Review Engine — never auto-merged.
"""

from packages.git_review.engine import GitReviewEngine
from packages.supervisor.supervisor import Supervisor

class Maintainer:
    def __init__(self):
        self.git = GitReviewEngine()
        self.supervisor = Supervisor()

    def propose_fix(self, task: str, source_files: Dict[str, str]) -> Dict:
        """Maintainer proposes a code change on a worktree."""
        worktree = self.git.create_worktree("main")
        review = self.git.propose_change(worktree, source_files)
        return {
            "status": "review_required",
            "task": task,
            "diff": review["diff"],
            "worktree": str(worktree)
        }

    def self_heal(self, error_log: str) -> Dict:
        """Supervisor calls this when the platform detects a bug in itself."""
        plan = self.supervisor.mythos.plan(f"Fix this error in Mythos Director source: {error_log}")
        return self.propose_fix("self-heal", plan.code_changes)
