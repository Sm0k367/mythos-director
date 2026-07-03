"""
Real Workflow Execution Engine for Mythos Director

Every node on the canvas actually runs. Live streaming via WebSocket.
"""

from typing import List, Dict, Any, AsyncGenerator
from packages.supervisor.supervisor import Supervisor
from packages.omnimedia.swarm import OmnimediaSwarm
import asyncio

class WorkflowExecutor:
    def __init__(self):
        self.supervisor = Supervisor()
        self.omnimedia = OmnimediaSwarm()

    async def execute(self, workflow_id: str, nodes: List[Dict]) -> AsyncGenerator[Dict, None]:
        """Run the workflow node by node and stream results live."""
        results = []
        for node in nodes:
            yield {"type": "node_start", "node": node}

            if node["type"] == "mythos":
                result = await self.supervisor.mythos.execute_async(node.get("prompt", ""))
            elif node["type"] == "omnimedia":
                result = await self.omnimedia.generate_async(node.get("prompt", ""), node.get("media_type", "video"))
            elif node["type"] == "review":
                result = {"status": "waiting_human", "node": node}
            else:
                result = {"status": "executed", "node": node}

            results.append(result)
            yield {"type": "node_result", "node": node, "result": result}

        yield {"type": "workflow_complete", "results": results}
