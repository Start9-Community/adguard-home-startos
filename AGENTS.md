# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

- Never let `main.ts` start AdGuard Home with an empty `users` list — AdGuard treats no users as no authentication, leaving the dashboard open.
- Keep plain DNS and DNS-over-TLS on the one `dns` binding: AdGuard Home has a single DNS listener, and StartOS rejects a second claim on the same internal port. Don't move it to a port ≤ 1024; StartOS owns port 53.
- Never set `bootstrap_dns` or `fallback_dns` to a public resolver: StartOS drops container DNS on port 53 to any address but `sdk.getOsIp`, so those lookups hang.
