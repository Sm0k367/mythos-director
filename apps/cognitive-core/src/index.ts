import express from 'express';
import { OpenAI } from 'openai';
import { z } from 'zod';

const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MythosRequest = z.object({
  prompt: z.string().min(3),
  agents: z.array(z.string()).optional().default(['mythos', 'prompt-engineer'])
});

app.post('/mythos', async (req, res) => {
  const { prompt, agents } = MythosRequest.parse(req.body);
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are the Mythos cognitive core. Orchestrate specialized agents to build cinematic worlds.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.9
  });

  res.json({
    mythos: completion.choices[0].message.content,
    agents_invoked: agents,
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Mythos cognitive core running on :${port}`);
});
