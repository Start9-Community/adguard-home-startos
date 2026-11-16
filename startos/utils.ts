export const uiPort = 3000
export const dnsPort = 5300
export const dotPort = 853
export const adminUsername = 'admin'

export const healthCheckDomain = 'one.one.one.one'

// Hides the DNS health check's lookups from the query log and statistics.
export const healthCheckIgnoreRule = `||${healthCheckDomain}^`
