import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useUploadViewModel } from '@/viewmodels/useUploadViewModel';
import {
  Button,
  ErrorBanner,
  ProgressBar,
  colors,
} from '@/components/UI';
import { formatBytes, toAbsoluteUrl } from '@/utils/file';

export default function UploadScreen() {
  const vm = useUploadViewModel();

  const isImage = vm.file?.type.startsWith('image/');

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Subir archivo</Text>

      {!!vm.error && <ErrorBanner message={vm.error} />}

      <View style={styles.row}>
        <View style={styles.flex}>
          <Button title="Galería" onPress={vm.selectImage} variant="outline" />
        </View>
        <View style={styles.flex}>
          <Button
            title="Documento"
            onPress={vm.selectDocument}
            variant="outline"
          />
        </View>
      </View>

      {/* Preview del archivo seleccionado */}
      {vm.file && (
        <View style={styles.preview}>
          {isImage ? (
            <Image source={{ uri: vm.file.uri }} style={styles.image} />
          ) : (
            <View style={styles.docIcon}>
              <Text style={styles.docIconText}>DOC</Text>
            </View>
          )}
          <Text style={styles.fileName} numberOfLines={1}>
            {vm.file.name}
          </Text>
          <Text style={styles.muted}>{formatBytes(vm.file.size)}</Text>
        </View>
      )}

      {/* Barra de progreso durante la subida */}
      {(vm.isUploading || vm.progress > 0) && (
        <View>
          <ProgressBar percent={vm.progress} />
          <Text style={styles.percent}>{vm.progress}%</Text>
        </View>
      )}

      {/* URL devuelta por la API tras subir */}
      {vm.uploadedUrl && (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>¡Subido!</Text>
          <Text style={styles.muted} numberOfLines={2}>
            {toAbsoluteUrl(vm.uploadedUrl)}
          </Text>
        </View>
      )}

      <Button
        title="Subir archivo"
        onPress={vm.upload}
        loading={vm.isUploading}
        disabled={!vm.file}
      />
      {vm.file && (
        <Button title="Limpiar" variant="outline" onPress={vm.reset} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
  preview: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: 180, height: 180, borderRadius: 10, marginBottom: 10 },
  docIcon: {
    width: 90,
    height: 110,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  docIconText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  fileName: { fontWeight: '700', color: colors.text },
  muted: { color: colors.muted, marginTop: 2 },
  percent: { textAlign: 'center', color: colors.muted, marginBottom: 8 },
  successCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 14,
    marginVertical: 12,
  },
  successTitle: { fontWeight: '800', color: '#166534', marginBottom: 4 },
});
