"""
Offline-first Mode for Mythos Director

Full experience with local models (Ollama + quantized Mythos core).
No API keys, no network required.
"""

from typing import Dict

class OfflineMode:
    def __init__(self, ollama_url: str = "http://localhost:11434"):
        self.ollama_url = ollama_url
        self.model = "mythos-core-q4"

    async def chat(self, prompt: str) -> Dict:
        """Route to local Ollama instead of cloud providers."""
        # In production: real HTTP call to Ollama
        return {
            "provider": "ollama",
            "model": self.model,
            "response": f"[LOCAL] {prompt[:50]}...",
            "offline": True
        }

    def is_available(self) -> bool:
        """Check if local model is running."""
        return True  # Placeholder
