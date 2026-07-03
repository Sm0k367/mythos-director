"""
Evaluation Dashboard for Mythos Director

Tracks success rate, cost per run, token usage, and self-improvement over time.
"""

from typing import Dict, List
from datetime import datetime

class EvaluationDashboard:
    def __init__(self):
        self.runs: List[Dict] = []

    def record_run(self, success: bool, tokens: int, cost_usd: float):
        self.runs.append({
            "timestamp": datetime.utcnow().isoformat(),
            "success": success,
            "tokens": tokens,
            "cost_usd": cost_usd
        })

    def get_metrics(self) -> Dict:
        total = len(self.runs)
        success_rate = sum(1 for r in self.runs if r["success"]) / total if total else 0
        total_cost = sum(r["cost_usd"] for r in self.runs)
        total_tokens = sum(r["tokens"] for r in self.runs)
        return {
            "total_runs": total,
            "success_rate": round(success_rate, 3),
            "total_cost_usd": round(total_cost, 2),
            "total_tokens": total_tokens,
            "avg_cost_per_run": round(total_cost / total, 4) if total else 0
        }
