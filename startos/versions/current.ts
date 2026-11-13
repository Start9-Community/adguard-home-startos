import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.107.80:1',
  releaseNotes: {
    en_US:
      'Rebuilt with the latest StartOS SDK and added a recommended setup guide, including StartTunnel, to the instructions',
    es_ES:
      'Reconstruido con el SDK de StartOS más reciente y se añadió a las instrucciones una guía de configuración recomendada, incluido StartTunnel',
    de_DE:
      'Mit dem neuesten StartOS-SDK neu erstellt und eine empfohlene Einrichtungsanleitung, einschließlich StartTunnel, in die Anleitung aufgenommen',
    pl_PL:
      'Przebudowano z najnowszym SDK StartOS i dodano do instrukcji zalecany przewodnik konfiguracji, w tym StartTunnel',
    fr_FR:
      "Reconstruit avec le dernier SDK StartOS et ajout d'un guide de configuration recommandé, y compris StartTunnel, aux instructions",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
