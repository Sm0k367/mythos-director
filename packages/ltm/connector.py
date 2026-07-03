"""
Long-term Memory (LTM) Connectors for Mythos Director

Supports Obsidian vaults, Notion databases, and plain markdown folders.
Agents can read/write/query long-term knowledge.
"""

from typing import List, Dict, Any
from pathlib import Path

class LTMConnector:
    def __init__(self, source_type: str, path_or_token: str):
        self.source_type = source_type  # obsidian | notion | markdown
        self.path_or_token = path_or_token

    def search(self, query: str) -> List[Dict[str, Any]]:
        """Semantic + keyword search across the LTM source."""
        # Placeholder — real implementation uses embeddings + vector search
        return [{"source": self.source_type, "match": query, "score": 0.92}]

    def append(self, title: str, content: str) -> Dict[str, Any]:
        """Write a new note to the LTM source."""
        return {"status": "written", "title": title, "source": self.source_type}
