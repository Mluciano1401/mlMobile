import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { PickedFile } from '@/models/FileUpload';
import { FILE_HOST } from '@/constants/config';

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const toAbsoluteUrl = (relativeUrl: string): string =>
  `${FILE_HOST}${relativeUrl}`;

export const pickImage = async (): Promise<PickedFile | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.fileName ?? `image_${Date.now()}.jpg`,
    type: asset.mimeType ?? 'image/jpeg',
    size: asset.fileSize ?? 0,
  };
};

export const pickDocument = async (): Promise<PickedFile | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['image/*', 'application/pdf'],
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.name ?? `doc_${Date.now()}`,
    type: asset.mimeType ?? 'application/octet-stream',
    size: asset.size ?? 0,
  };
};
