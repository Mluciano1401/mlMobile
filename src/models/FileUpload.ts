export interface PickedFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export interface UploadResponse {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  content_type: string;
}
