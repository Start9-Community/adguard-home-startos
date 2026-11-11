import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.107.80:0',
  releaseNotes: {
    en_US:
      'Updates AdGuard Home to v0.107.80, a security release with updated Go dependencies and Multipath TCP disabled',
    es_ES:
      'Actualiza AdGuard Home a v0.107.80, una versión de seguridad con dependencias de Go actualizadas y Multipath TCP desactivado',
    de_DE:
      'Aktualisiert AdGuard Home auf v0.107.80, ein Sicherheitsupdate mit aktualisierten Go-Abhängigkeiten und deaktiviertem Multipath TCP',
    pl_PL:
      'Aktualizuje AdGuard Home do v0.107.80, wydania bezpieczeństwa z zaktualizowanymi zależnościami Go i wyłączonym Multipath TCP',
    fr_FR:
      'Met à jour AdGuard Home vers v0.107.80, une version de sécurité avec des dépendances Go mises à jour et Multipath TCP désactivé',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
