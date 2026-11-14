import { i18n } from './i18n'
import { sdk } from './sdk'
import { dnsPort, dotPort, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const webOrigin = await sdk.MultiHost.of(effects, 'web').bindPort(uiPort, {
    protocol: 'http',
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web Interface'),
    id: 'ui',
    description: i18n('The AdGuard Home dashboard and settings'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const doh = sdk.createInterface(effects, {
    name: i18n('DNS-over-HTTPS'),
    id: 'doh',
    description: i18n(
      'Encrypted DNS endpoint for browsers and operating systems that support DNS-over-HTTPS',
    ),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/dns-query',
    query: {},
  })

  const webReceipt = await webOrigin.export([ui, doh])

  const dnsOrigin = await sdk.MultiHost.of(effects, 'dns').bindPort(dnsPort, {
    protocol: null,
    secure: { ssl: false },
    preferredExternalPort: dnsPort,
    addSsl: null,
  })
  const dnsReceipt = await dnsOrigin.export([
    sdk.createInterface(effects, {
      name: i18n('Plain DNS'),
      id: 'dns',
      description: i18n(
        'Unencrypted DNS over UDP and TCP, for routers and resolvers that accept a custom DNS port',
      ),
      type: 'api',
      masked: false,
      schemeOverride: null,
      username: null,
      path: '',
      query: {},
    }),
  ])

  // Public DoT must not expose plaintext DNS.
  const dotOrigin = await sdk.MultiHost.of(effects, 'dot').bindPort(dnsPort, {
    protocol: null,
    secure: null,
    preferredExternalPort: dnsPort,
    addSsl: { preferredExternalPort: dotPort, alpn: null },
  })
  const dotReceipt = await dotOrigin.export([
    sdk.createInterface(effects, {
      name: i18n('DNS-over-TLS'),
      id: 'dot',
      description: i18n(
        'Encrypted DNS for Android Private DNS and other DNS-over-TLS clients',
      ),
      type: 'api',
      masked: false,
      schemeOverride: null,
      username: null,
      path: '',
      query: {},
    }),
  ])

  return [webReceipt, dnsReceipt, dotReceipt]
})
