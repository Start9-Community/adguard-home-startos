import { adguardYaml } from './fileModels/AdGuardHome.yaml'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { adminUsername, dnsPort, healthCheckDomain, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting AdGuard Home!'))

  const passwordHash = await storeJson
    .read((s) => s.adminPasswordHash)
    .const(effects)
  // An empty users list would leave the dashboard open to anyone.
  if (!passwordHash) {
    throw new Error(
      i18n('No admin password is set. Run the Set Admin Password action.'),
    )
  }

  const osIp = await sdk.getOsIp(effects)
  await adguardYaml.merge(effects, {
    http: { address: `0.0.0.0:${uiPort}`, doh: { insecure_enabled: true } },
    users: [{ name: adminUsername, password: passwordHash }],
    dns: {
      bind_hosts: ['0.0.0.0'],
      port: dnsPort,
      trusted_proxies: ['127.0.0.0/8', '::1/128', `${osIp}/32`],
      // StartOS drops container DNS on port 53 to any other address.
      bootstrap_dns: [osIp],
    },
  })

  const adguardSub = sdk.SubContainer.of(
    effects,
    { imageId: 'adguard-home' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: 'conf',
        mountpoint: '/opt/adguardhome/conf',
        readonly: false,
      })
      .mountVolume({
        volumeId: 'main',
        subpath: 'work',
        mountpoint: '/opt/adguardhome/work',
        readonly: false,
      }),
    'adguard-home-sub',
  )

  return sdk.Daemons.of(effects)
    .addDaemon('adguard-home', {
      subcontainer: adguardSub,
      exec: { command: sdk.useEntrypoint() },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          }),
      },
      requires: [],
    })
    .addHealthCheck('dns', {
      ready: {
        display: i18n('DNS Server'),
        trigger: sdk.trigger.statusTrigger(60_000, {
          starting: 5_000,
          failure: 15_000,
        }),
        fn: async () => {
          // A fresh name each run, so AdGuard's cache can't answer it.
          const probeName = `${Math.random().toString(36).slice(2, 10)}.${healthCheckDomain}`
          // Access allowlists must admit the loopback health-check client.
          const { exitCode, stdout } = await adguardSub.exec(
            ['nslookup', '-type=a', probeName, `127.0.0.1:${dnsPort}`],
            { timeout: 20_000 },
          )
          // NXDOMAIN is a healthy response to a random probe.
          const healthy =
            exitCode === 0 ||
            (exitCode === 1 &&
              stdout
                .toString()
                .split('\n')
                .includes(`** server can't find ${probeName}: NXDOMAIN`))
          if (healthy)
            return {
              result: 'success' as const,
              message: i18n('AdGuard Home is resolving DNS queries'),
            }
          const allowed = await adguardYaml
            .read((c) => c.dns.allowed_clients)
            .once()
          return {
            result: 'failure' as const,
            message:
              allowed?.length && !allowed.some((c) => c.startsWith('127.'))
                ? i18n(
                    'AdGuard Home refuses the health check. Add 127.0.0.1 under Settings → Access settings → Allowed clients in AdGuard Home.',
                  )
                : i18n(
                    'AdGuard Home is not resolving DNS queries. Check its upstream DNS servers.',
                  ),
          }
        },
      },
      requires: ['adguard-home'],
    })
    .addHealthCheck('open-resolver', {
      ready: {
        display: i18n('Plain DNS Exposure'),
        trigger: sdk.trigger.statusTrigger(30_000),
        fn: async () => {
          const isPublic = await sdk.host
            .getOwn(
              effects,
              'dns',
              (h) =>
                !!h?.bindings[dnsPort]?.interfaces.dns?.addressInfo?.public
                  .hostnames.length,
            )
            .once()
          if (!isPublic)
            return {
              result: 'success' as const,
              message: i18n('Plain DNS is not published to the internet'),
            }
          const allowed = await adguardYaml
            .read((c) => c.dns.allowed_clients)
            .once()
          return allowed?.length
            ? {
                result: 'success' as const,
                message: i18n(
                  'Plain DNS on the internet answers only allowed clients',
                ),
              }
            : {
                result: 'failure' as const,
                message: i18n(
                  'Plain DNS is open to anyone on the internet. Turn off its public addresses, or list your clients under Settings → Access settings → Allowed clients in AdGuard Home. Include 127.0.0.1 for the DNS health check.',
                ),
              }
        },
      },
      requires: [],
    })
})
