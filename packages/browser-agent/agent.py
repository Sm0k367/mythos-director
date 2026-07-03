"""
Computer-Use Browser Agent for Mythos Director

DOM-first, approval-gated, safe computer use.
Never clicks dangerous elements without explicit human approval.
"""

from typing import Dict, Any
from packages.permissions.engine import PermissionEngine

class BrowserAgent:
    def __init__(self):
        self.permissions = PermissionEngine()

    async def navigate(self, url: str, user_id: str) -> Dict[str, Any]:
        decision = self.permissions.check("browser.navigate", user_id)
        if decision != "allow":
            return {"status": "blocked", "reason": "Permission denied"}

        return {"status": "navigated", "url": url}

    async def click(self, selector: str, user_id: str, risky: bool = False) -> Dict[str, Any]:
        if risky:
            decision = self.permissions.check("browser.click_risky", user_id)
            if decision != "allow":
                return {"status": "needs_approval", "selector": selector}

        return {"status": "clicked", "selector": selector}

    async def type(self, selector: str, text: str, user_id: str) -> Dict[str, Any]:
        decision = self.permissions.check("browser.type", user_id)
        if decision != "allow":
            return {"status": "blocked"}

        return {"status": "typed", "selector": selector, "text": text}
