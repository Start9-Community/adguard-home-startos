# Updating the upstream version

Upstream is the official `adguard/adguardhome` Docker image, used unmodified. It is pinned by its `v`-prefixed release tag.

## Determining the upstream version

The pin is `images['adguard-home'].source.dockerTag` in `startos/manifest/index.ts`. Track **stable** GitHub releases only; upstream publishes `v0.108.0-b.*` and `v1.0.0-b.*` betas and `beta`/`edge` image tags alongside them.

```bash
gh api 'repos/AdguardTeam/AdGuardHome/releases?per_page=100' --jq '.[] | select(.draft == false and .prerelease == false) | .tag_name' | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -n 1
curl -fsS https://hub.docker.com/v2/repositories/adguard/adguardhome/tags/<tag> | jq -r '[.images[].architecture] | unique | join(" ")'   # must include amd64 and arm64
```

The **Check upstream** workflow runs this every Monday and opens an issue when a newer stable release exists, saying whether its image is on Docker Hub for both architectures. GitHub pauses scheduled workflows in a public repository after 60 days without activity; re-enable it from the repository's **Actions** tab.

## Applying the bump

1. Set `dockerTag` to `adguard/adguardhome:vX.Y.Z` in `startos/manifest/index.ts`.
2. Set `version` in `startos/versions/current.ts` to `X.Y.Z:0` (no `v`), and update the release notes.
3. Read the upstream changelog for config schema changes. AdGuard Home migrates `AdGuardHome.yaml` itself on start; the package only writes the install values and re-asserts the keys listed in README.md § File Models, so check those still exist under the same names. Check that the image still ships `nslookup`, which the DNS health check runs.
4. `schema_version`'s `.catch()` in `startos/fileModels/AdGuardHome.yaml.ts` only seeds a brand-new file. Raise it to the new release's schema if it changed (install the new image fresh and read `schema_version` from the file it writes).
