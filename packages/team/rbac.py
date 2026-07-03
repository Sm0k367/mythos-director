"""
Team Mode + Org Memory + RBAC for Mythos Director

Multi-user, shared long-term memory, role-based access control.
"""

from typing import Dict, List
from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"

class TeamMode:
    def __init__(self):
        self.orgs: Dict[str, Dict] = {}

    def create_org(self, name: str, owner: str) -> Dict:
        self.orgs[name] = {
            "owner": owner,
            "members": {owner: Role.ADMIN},
            "shared_memory": []
        }
        return {"status": "created", "org": name}

    def add_member(self, org: str, user: str, role: Role) -> Dict:
        if org not in self.orgs:
            return {"status": "not_found"}
        self.orgs[org]["members"][user] = role
        return {"status": "added", "user": user, "role": role}

    def has_permission(self, org: str, user: str, action: str) -> bool:
        role = self.orgs.get(org, {}).get("members", {}).get(user)
        if role == Role.ADMIN:
            return True
        if role == Role.MEMBER and action in ["run", "read"]:
            return True
        if role == Role.VIEWER and action == "read":
            return True
        return False
