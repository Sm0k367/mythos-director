"""
Fail-closed Permission Engine for Mythos Director
"""

from enum import Enum
from typing import Dict, Literal

class Decision(str, Enum):
    ALLOW = "allow"
    ASK = "ask"
    DENY = "deny"

class PermissionEngine:
    def __init__(self):
        # Default policy — fail closed
        self.policy: Dict[str, Decision] = {
            "mythos.plan": Decision.ALLOW,
            "mythos.execute": Decision.ALLOW,
            "omnimedia.generate": Decision.ALLOW,
            "shell": Decision.ASK,
            "fs.write": Decision.ASK,
            "git.push": Decision.ASK,
            "workflow.create": Decision.ASK,
            "ltm.write": Decision.ASK,
        }

    def check(self, tool: str, user_id: str) -> Decision:
        return self.policy.get(tool, Decision.DENY)

    def set_policy(self, tool: str, decision: Decision):
        self.policy[tool] = decision
