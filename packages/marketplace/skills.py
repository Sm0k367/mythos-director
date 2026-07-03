"""
Skills / Agent Marketplace for Mythos Director

Agents can publish, discover, and install new capabilities at runtime.
"""

from typing import Dict, List

class SkillMarketplace:
    def __init__(self):
        self.skills: Dict[str, Dict] = {}

    def publish(self, name: str, code: str, author: str, description: str) -> Dict:
        self.skills[name] = {
            "code": code,
            "author": author,
            "description": description,
            "downloads": 0
        }
        return {"status": "published", "name": name}

    def discover(self, query: str = "") -> List[Dict]:
        results = []
        for name, meta in self.skills.items():
            if query.lower() in name.lower() or query.lower() in meta["description"].lower():
                results.append({"name": name, **meta})
        return results

    def install(self, name: str) -> Dict:
        if name not in self.skills:
            return {"status": "not_found"}
        self.skills[name]["downloads"] += 1
        return {"status": "installed", "name": name}
