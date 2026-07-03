import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

export async function POST(request: Request) {
  const { prompt, type, agents = ['omnimedia', 'prompt-engineer'] } = await request.json();

  if (type === 'video') {
    if (!process.env.HF_TOKEN) {
      return NextResponse.json({
        type: "video",
        prompt,
        agents_invoked: agents,
        status: "completed",
        video_url: "https://cdn.mythos.director/demo/mythos-director-live.mp4",
        note: "Using demo (add HF_TOKEN for real generation)"
      });
    }

    try {
      const video = await hf.textToVideo({
        model: "ali-vilab/text-to-video-ms-1.7b",
        inputs: prompt,
      });

      return NextResponse.json({
        type: "video",
        prompt,
        agents_invoked: agents,
        status: "completed",
        video_url: video,
        job_id: `mythos-${Date.now()}`
      });
    } catch (error) {
      return NextResponse.json({
        type: "video",
        prompt,
        status: "error",
        error: "Video generation failed"
      }, { status: 500 });
    }
  }

  if (type === 'image') {
    try {
      const image = await hf.textToImage({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: prompt,
      });

      return NextResponse.json({
        type: "image",
        prompt,
        agents_invoked: agents,
        status: "completed",
        image_url: image,
      });
    } catch (error) {
      return NextResponse.json({
        type: "image",
        prompt,
        status: "error",
        error: "Image generation failed"
      }, { status: 500 });
    }
  }

  if (type === 'audio') {
    try {
      const audio = await hf.textToSpeech({
        model: "espnet/kan-bayashi_ljspeech_vits",
        inputs: prompt,
      });

      return NextResponse.json({
        type: "audio",
        prompt,
        agents_invoked: agents,
        status: "completed",
        audio_url: audio,
      });
    } catch (error) {
      return NextResponse.json({
        type: "audio",
        prompt,
        status: "error",
        error: "Audio generation failed"
      }, { status: 500 });
    }
  }

  return NextResponse.json({
    type,
    prompt,
    agents_invoked: agents,
    status: "completed"
  });
}
