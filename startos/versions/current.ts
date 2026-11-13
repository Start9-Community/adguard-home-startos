import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { adguardYaml } from '../fileModels/AdGuardHome.yaml'
import { dnsPort, healthCheckDomain, healthCheckIgnoreRule } from '../utils'

export const current = VersionInfo.of({
  version: '0.107.80:2',
  releaseNotes: {
    en_US:
      'Initial release on the community registry, with AdGuard Home 0.107.80. See the [upstream release notes](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). Plain DNS address settings reset when updating from an earlier GitHub build; re-enable any public Plain DNS addresses. DNS-over-TLS domains are preserved.',
    es_ES:
      'Primera versión en el registro comunitario, con AdGuard Home 0.107.80. Consulte las [notas de la versión de upstream](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). Los ajustes de direcciones de DNS sin cifrar se restablecen al actualizar desde una compilación anterior de GitHub; vuelva a habilitar sus direcciones públicas de DNS sin cifrar. Los dominios de DNS sobre TLS se conservan.',
    de_DE:
      'Erste Veröffentlichung in der Community-Registry, mit AdGuard Home 0.107.80. Siehe die [Upstream-Versionshinweise](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). Beim Update von einem früheren GitHub-Build werden die Adresseinstellungen für unverschlüsseltes DNS zurückgesetzt; aktivieren Sie öffentliche Adressen für unverschlüsseltes DNS erneut. DNS-over-TLS-Domains bleiben erhalten.',
    pl_PL:
      'Pierwsze wydanie w rejestrze społeczności, z AdGuard Home 0.107.80. Zobacz [informacje o wydaniu upstream](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). Aktualizacja z wcześniejszej wersji z GitHub resetuje ustawienia adresów nieszyfrowanego DNS; ponownie włącz publiczne adresy nieszyfrowanego DNS. Domeny DNS-over-TLS zostają zachowane.',
    fr_FR:
      'Première publication dans le registre communautaire, avec AdGuard Home 0.107.80. Consultez les [notes de version upstream](https://github.com/AdguardTeam/AdGuardHome/releases/tag/v0.107.80). La mise à jour depuis une version antérieure de GitHub réinitialise les paramètres des adresses DNS non chiffrées ; réactivez vos adresses publiques de DNS non chiffré. Les domaines DNS-over-TLS sont conservés.',
  },
  migrations: {
    up: async ({ effects }) => {
      await sdk.MultiHost.of(effects, 'dns').retirePort(dnsPort)

      const conf = await adguardYaml.read().once()
      if (!conf) return
      const toRule = (ignored: string[]) =>
        ignored.map((h) =>
          h === healthCheckDomain ? healthCheckIgnoreRule : h,
        )
      await adguardYaml.merge(effects, {
        querylog: { ignored: toRule(conf.querylog.ignored) },
        statistics: { ignored: toRule(conf.statistics.ignored) },
      })
    },
    down: IMPOSSIBLE,
  },
})
