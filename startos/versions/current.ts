import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { dnsPort } from '../utils'

export const current = VersionInfo.of({
  version: '0.107.80:1',
  releaseNotes: {
    en_US:
      'Initial release on the community registry, with AdGuard Home 0.107.80. See the [upstream release notes](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). If you installed an earlier build from GitHub and added a domain to DNS-over-TLS, add it again.',
    es_ES:
      'Primera versión en el registro comunitario, con AdGuard Home 0.107.80. Consulte las [notas de la versión de upstream](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). Si instaló una compilación anterior desde GitHub y añadió un dominio a DNS sobre TLS, vuelva a añadirlo.',
    de_DE:
      'Erste Veröffentlichung in der Community-Registry, mit AdGuard Home 0.107.80. Siehe die [Upstream-Versionshinweise](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). Wenn Sie einen früheren Build von GitHub installiert und DNS-over-TLS eine Domain hinzugefügt haben, fügen Sie sie erneut hinzu.',
    pl_PL:
      'Pierwsze wydanie w rejestrze społeczności, z AdGuard Home 0.107.80. Zobacz [informacje o wydaniu upstream](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). Jeśli zainstalowano wcześniejszą wersję z GitHub i dodano domenę do DNS-over-TLS, dodaj ją ponownie.',
    fr_FR:
      'Première publication dans le registre communautaire, avec AdGuard Home 0.107.80. Consultez les [notes de version upstream](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). Si vous avez installé une version antérieure depuis GitHub et ajouté un domaine à DNS-over-TLS, ajoutez-le à nouveau.',
  },
  migrations: {
    up: async ({ effects }) => {
      await sdk.MultiHost.of(effects, 'dot').retire()
      await sdk.MultiHost.of(effects, 'dns').retirePort(dnsPort)
    },
    down: IMPOSSIBLE,
  },
})
