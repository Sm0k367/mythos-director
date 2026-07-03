# Mythos Director Supervisor

The central orchestrator that decomposes goals and dispatches to Mythos cognitive core + Omnimedia swarm.

## Architecture

- Supervisor receives high-level task
- Decomposes into sub-tasks
- Routes to appropriate agents:
  - Mythos cognitive core (reasoning, planning, memory)
  - Omnimedia swarm (video, image, audio generation)
  - Prompt-Engineer swarm
- Every action goes through Permission Engine (fail-closed)
- Git review + worktree for any code changes
- Full audit trail

## Production

https://web-b534wgt2w-epic-tech-ai-projects.vercel.app
