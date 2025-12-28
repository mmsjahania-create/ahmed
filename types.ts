
export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  convertedUrl?: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  insights?: string;
  originalSize: number;
  convertedSize?: number;
}

export enum ConversionStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error'
}
