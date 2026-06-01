import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
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
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  });

  if (result.didCancel || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri ?? '',
    name: asset.fileName ?? `image_${Date.now()}.jpg`,
    type: asset.type ?? 'image/jpeg',
    size: asset.fileSize ?? 0,
  };
};

export const pickDocument = async (): Promise<PickedFile | null> => {
  try {
    const doc = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
    });

    return {
      uri: doc.uri,
      name: doc.name ?? `doc_${Date.now()}`,
      type: doc.type ?? 'application/octet-stream',
      size: doc.size ?? 0,
    };
  } catch (err) {
    if (DocumentPicker.isCancel(err)) return null;
    throw err;
  }
};
