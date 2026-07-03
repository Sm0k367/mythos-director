"""
n8n-style Workflow Engine for Mythos Director
"""

from typing import List, Dict, Any
from packages.supervisor.supervisor import Supervisor

class WorkflowEngine:
    def __init__(self):
        self.supervisor = Supervisor()
        self.workflows: Dict[str, List[Dict]] = {}

    def create(self, name: str, nodes: List[Dict]) -> str:
        self.workflows[name] = nodes
        return name

    def run(self, name: str, input_data: Dict) -> Dict[str, Any]:
        nodes = self.workflows.get(name, [])
        results = []
        for node in nodes:
            if node["type"] == "mythos":
                result = self.supervisor.mythos.execute(node["prompt"])
            elif node["type"] == "omnimedia":
                result = self.supervisor.omnimedia.generate(node["prompt"])
            else:
                result = {"status": "skipped"}
            results.append(result)
        return {"workflow": name, "results": results}
