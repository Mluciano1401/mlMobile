import { httpClient } from './httpClient';
import { ENDPOINTS } from '@/constants/endpoints';
import { PickedFile, UploadResponse } from '@/models/FileUpload';

export const UploadService = {
  /**
   * Sube un archivo al endpoint POST /upload.
   * @param file archivo seleccionado por el usuario.
   * @param onProgress callback con el porcentaje 0-100.
   */
  async upload(
    file: PickedFile,
    onProgress?: (percent: number) => void,
  ): Promise<UploadResponse> {
    const formData = new FormData();

    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const response = await httpClient.post<UploadResponse>(
      ENDPOINTS.upload,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: event => {
          if (onProgress && event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            onProgress(percent);
          }
        },
      },
    );

    return response.data;
  },
};
