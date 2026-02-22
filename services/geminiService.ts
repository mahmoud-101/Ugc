
import { GoogleGenAI, Type } from '@google/genai';
import type { Storyboard, Shot, Persona, AdOptions } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable is not set. The application may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const storyboardSchema = {
  type: Type.OBJECT,
  properties: {
    persona: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        age: { type: Type.INTEGER },
        personality: { type: Type.STRING },
        speaking_style: { type: Type.STRING },
        location: { type: Type.STRING },
      },
       required: ["name", "age", "personality", "speaking_style", "location"],
    },
    storyboard: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          shot_id: { type: Type.INTEGER },
          camera: { type: Type.STRING },
          scene: { type: Type.STRING },
          action: { type: Type.STRING },
          dialogue: { type: Type.STRING },
        },
        required: ["shot_id", "camera", "scene", "action", "dialogue"],
      },
    },
    aspectRatio: { type: Type.STRING },
  },
  required: ["persona", "storyboard", "aspectRatio"],
};

export async function analyzeProduct(base64Image: string, category: string): Promise<string> {
    const prompt = `Analyze this product image. It is described as a "${category}". Provide a detailed description covering its potential name, materials (metal, plastic, cloth, etc.), prominent colors, and likely uses. Be concise and focus on visual and functional attributes.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: prompt },
            ],
        },
    });

    return response.text ?? '';
}


export async function generateStoryboard(productInfo: string, dialect: string, mood: string, features: string, base64Image: string): Promise<Storyboard> {
  const prompt = `
    You are an expert advertising creative director for short-form video ads. 
    Your task is to generate a complete ad campaign storyboard in JSON format based on the provided product image and its description.

    Product Description: ${productInfo}
    ${features ? `Key Product Features to include: ${features}` : ''}

    Ad Characteristics:
    - Dialect: ${dialect}
    - Mood: ${mood}

    Instructions:
    - Base your creative choices on the visual information in the product image.
    - Generate a complete JSON output with two main keys: "persona" and "storyboard".
    1.  **Persona:** Create a character persona that would realistically use or endorse the product shown in the image. Include their name, age, personality, speaking style, and a suitable location for filming.
    2.  **Storyboard:** Create a storyboard with exactly 6 shots. Each shot must have a unique shot_id from 1 to 6. For each shot, provide details for "camera", "scene", "action", and "dialogue" (in the specified ${dialect}). The shots should tell a compelling story about the product in the image, weaving in the key features naturally. The actions described must be safe, positive, and suitable for a general audience.
    
    The first 1-2 shots should be a standard UGC-style hook, followed by cinematic b-roll shots of the product, and finally a call-to-action with the persona.
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt },
      ]
    },
    config: {
        responseMimeType: 'application/json',
        responseSchema: storyboardSchema,
    }
  });

  const rawJson = response.text?.trim();
  if (!rawJson) {
    throw new Error("The AI returned an empty response for the storyboard.");
  }

  try {
    return JSON.parse(rawJson) as Storyboard;
  } catch (e) {
    console.error("Failed to parse storyboard JSON:", rawJson);
    throw new Error("The AI returned an invalid storyboard format.");
  }
}

export async function generateShotImage(shot: Shot, persona: Persona, aspectRatio: AdOptions['aspectRatio'], base64ProductImage: string): Promise<string> {
  
  const prompt = `
    You are a professional product photographer creating a cinematic shot for a social media ad.
    
    **CRITICAL INSTRUCTION:**
    I have provided an image of a specific product. You MUST place this EXACT product into the new scene you generate. Do NOT alter the product's appearance, color, or branding. Maintain perfect product consistency.

    **Scene Details:**
    - **Character:** ${persona.name}, a ${persona.age}-year-old with a ${persona.personality} personality. They are in a ${persona.location}.
    - **Shot Description:**
        - **Camera:** ${shot.camera}
        - **Scene:** ${shot.scene}
        - **Action:** ${shot.action}

    **Style Guide:**
    Create a cinematic, film-grade shot. Aim for realistic skin texture, shallow depth of field, and a high-end commercial look as if shot on an ARRI Alexa camera.
    `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
        parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64ProductImage } },
            { text: prompt }
        ]
    },
    config: {
        imageConfig: { aspectRatio: aspectRatio }
    }
  });

  // Check for prompt blocking which indicates a safety policy violation.
  if (response.promptFeedback?.blockReason) {
    const { blockReason, blockReasonMessage } = response.promptFeedback;
    const errorMessage = `Image generation was blocked. Reason: ${blockReason}. ${blockReasonMessage || ''}`;
    console.error(errorMessage, response.promptFeedback);
    throw new Error(errorMessage);
  }

  const candidate = response.candidates?.[0];

  // Also check if the generation finished for reasons other than "STOP".
  if (candidate && candidate.finishReason && candidate.finishReason !== 'STOP') {
    const errorMessage = `Image generation finished with reason: ${candidate.finishReason}.`;
    console.error(errorMessage, candidate);
    throw new Error(errorMessage);
  }

  // Find the image part in the response.
  for (const part of candidate?.content?.parts ?? []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  // If no image part is found, the model may have returned text (e.g., a refusal).
  const textResponse = response.text;
  if (textResponse) {
      const errorMessage = `Image generation failed and returned a text response: ${textResponse}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
  }
  
  // A final fallback error if the response is empty or in an unexpected format.
  throw new Error('Image generation failed, no image data found in response.');
}