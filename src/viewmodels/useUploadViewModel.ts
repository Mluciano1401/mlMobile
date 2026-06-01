import { useState, useCallback } from 'react';
import { UploadService } from '@/services/uploadService';
import { pickImage, pickDocument } from '@/utils/file';
import { PickedFile } from '@/models/FileUpload';
import { MAX_FILE_SIZE } from '@/constants/config';

export function useUploadViewModel() {
  const [file, setFile] = useState<PickedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const reset = useCallback(() => {
    setFile(null);
    setProgress(0);
    setError(null);
    setUploadedUrl(null);
  }, []);

  const selectImage = useCallback(async () => {
    setError(null);
    const picked = await pickImage();
    if (picked) validateAndSet(picked);
  }, []);

  const selectDocument = useCallback(async () => {
    setError(null);
    const picked = await pickDocument();
    if (picked) validateAndSet(picked);
  }, []);

  const validateAndSet = (picked: PickedFile) => {
    if (picked.size > MAX_FILE_SIZE) {
      setError('El archivo supera el límite de 5 MB.');
      return;
    }
    setUploadedUrl(null);
    setProgress(0);
    setFile(picked);
  };

  const upload = useCallback(async (): Promise<boolean> => {
    if (!file) {
      setError('Selecciona un archivo primero.');
      return false;
    }
    setIsUploading(true);
    setError(null);
    setProgress(0);
    try {
      const res = await UploadService.upload(file, setProgress);
      setUploadedUrl(res.url);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [file]);

  return {
    file,
    progress,
    isUploading,
    error,
    uploadedUrl,
    selectImage,
    selectDocument,
    upload,
    reset,
  };
}
