import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:0',
  releaseNotes: {
    en_US:
      'Update to AdGuard Home 1.0.0, with a redesigned web interface. See the [upstream release notes](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v1.0.0).',
    es_ES:
      'Actualización a AdGuard Home 1.0.0, con una interfaz web rediseñada. Consulte las [notas de la versión de upstream](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v1.0.0).',
    de_DE:
      'Update auf AdGuard Home 1.0.0 mit überarbeiteter Weboberfläche. Siehe die [Upstream-Versionshinweise](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v1.0.0).',
    pl_PL:
      'Aktualizacja do AdGuard Home 1.0.0 z przeprojektowanym interfejsem webowym. Zobacz [informacje o wydaniu upstream](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v1.0.0).',
    fr_FR:
      "Mise à jour vers AdGuard Home 1.0.0, avec une interface web repensée. Consultez les [notes de version upstream](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v1.0.0).",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
