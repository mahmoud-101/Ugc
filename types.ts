
export interface AdOptions {
  category: string;
  dialect: 'Egyptian' | 'Gulf' | 'Formal Arabic';
  mood: 'Comedy' | 'Serious' | 'Luxury' | 'Casual' | 'Energetic';
  features: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
}

export interface Shot {
  shot_id: number;
  camera: string;
  scene: string;
  action: string;
  dialogue: string;
}

export interface Persona {
  name: string;
  age: number;
  personality: string;
  speaking_style: string;
  location: string;
}

export interface Storyboard {
  persona: Persona;
  storyboard: Shot[];
  aspectRatio: AdOptions['aspectRatio'];
}
