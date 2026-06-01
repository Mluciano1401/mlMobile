import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDashboardViewModel, QueryStatus } from '@/viewmodels/useDashboardViewModel';
import { useAuthViewModel } from '@/viewmodels/useAuthViewModel';
import { Button, ErrorBanner, colors } from '@/components/UI';

export default function DashboardScreen() {
  const vm = useDashboardViewModel();
  const auth = useAuthViewModel();

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={vm.isLoading}
          onRefresh={vm.refetch}
          colors={[colors.primary]}
        />
      }>
      <Text style={styles.title}>Dashboard</Text>

      {!!vm.error && <ErrorBanner message={vm.error} />}

      {/* Panel de concurrencia: estado individual de cada query */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>useQueries — Consultas en paralelo</Text>
        <Text style={styles.muted}>
          Las 3 consultas se lanzan al mismo tiempo. El tiempo total ≈ la más
          lenta, no la suma de las tres.
        </Text>
        <View style={styles.queryList}>
          {vm.queryStatuses.map((q: QueryStatus) => (
            <QueryRow key={q.label} status={q} />
          ))}
        </View>
      </View>

      {vm.isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        vm.data && (
          <>
            <View style={styles.statRow}>
              <StatCard label="Usuarios" value={`${vm.data.totalUsers}`} />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Último usuario registrado</Text>
              <Text style={styles.cardValue}>
                {vm.data.latestUser?.name ?? '—'}
              </Text>
              <Text style={styles.muted}>
                {vm.data.latestUser?.email ?? ''}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>¿Cómo funciona la concurrencia?</Text>
              <Text style={styles.muted}>
                {'Promise.all([p1, p2, p3]) y useQueries([q1, q2, q3]) lanzan\n' +
                  'las promesas sin esperar a que la anterior termine.\n\n' +
                  'Secuencial: t ≈ t1 + t2 + t3\n' +
                  'Concurrente: t ≈ max(t1, t2, t3)  ← hasta 3× más rápido'}
              </Text>
            </View>
          </>
        )
      )}

      <View style={styles.footer}>
        <Button title="Cerrar sesión" variant="danger" onPress={auth.logout} />
      </View>
    </ScrollView>
  );
}

function QueryRow({ status }: { status: QueryStatus }) {
  const color = status.error
    ? colors.danger
    : status.loaded
    ? '#16a34a'
    : colors.primary;
  const label = status.error ? 'Error' : status.loaded ? 'OK' : '…';

  return (
    <View style={styles.queryRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.queryLabel}>{status.label}</Text>
      <Text style={[styles.queryStatus, { color }]}>{label}</Text>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  loader: { marginTop: 20 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  statRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 13, color: colors.muted, marginTop: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 6,
  },
  muted: { color: colors.muted, marginTop: 6, lineHeight: 20 },
  queryList: { marginTop: 12, gap: 10 },
  queryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  queryLabel: { flex: 1, color: colors.text, fontSize: 14 },
  queryStatus: { fontWeight: '700', fontSize: 13 },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  footer: { marginTop: 12 },
});
