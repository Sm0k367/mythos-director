"""
Mythos Director Supervisor — 100x Iron Jarvis core
"""

from typing import List, Dict, Any
from packages.permissions.engine import PermissionEngine
from packages.mythos.core import MythosCore
from packages.omnimedia.swarm import OmnimediaSwarm

class Supervisor:
    def __init__(self):
        self.permissions = PermissionEngine()
        self.mythos = MythosCore()
        self.omnimedia = OmnimediaSwarm()

    def run(self, goal: str, user_id: str) -> Dict[str, Any]:
        # 1. Decompose goal
        plan = self.mythos.plan(goal)

        # 2. Check permissions for every step
        for step in plan.steps:
            decision = self.permissions.check(step.tool, user_id)
            if decision == "deny":
                return {"status": "blocked", "reason": f"Tool {step.tool} denied"}
            if decision == "ask":
                return {"status": "needs_review", "step": step}

        # 3. Execute with Mythos + Omnimedia
        result = self.mythos.execute(plan)
        media = self.omnimedia.generate(plan.media_prompts)

        return {
            "status": "completed",
            "mythos": result,
            "media": media,
            "audit": plan.audit_trail
        }
