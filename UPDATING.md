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
2. Set `version` in `startos/versions/current.ts` to `X.Y.Z:0` (no `v`), and update the release notes. If `current.ts` carries a migration (an `up` that does work), first move that version to its own file, as the packaging guide's `versions.md` describes, so its migration stays with it.
3. Read the upstream changelog for config schema changes. AdGuard Home migrates `AdGuardHome.yaml` itself on start; the package only writes the install values and re-asserts the keys listed in README.md § File Models, so check those still exist under the same names. Check that the image still ships `nslookup`, which the DNS health check runs.
4. `schema_version`'s `.catch()` in `startos/fileModels/AdGuardHome.yaml.ts` only seeds a brand-new file. Raise it to the new release's schema if it changed (install the new image fresh and read `schema_version` from the file it writes).

## Releasing

Commit the version bump and push `master`. Nothing else is needed.

The **Tag and Release** workflow runs on every push to `master` that changes more than Markdown. It reads the package id and `version` from `startos/versions/current.ts` and asks the registry in the `REFERENCE_REGISTRY` repository variable whether that version exists. If it does, the run stops; a push that doesn't change the version publishes nothing. Otherwise it force-pushes the tag `v` plus the version with `:` replaced by `_` (`0.107.79:1` → `v0.107.79_1`), builds each architecture, creates the GitHub Release with the `.s9pk` files, and adds them to the registry in `RELEASE_REGISTRY`, which downloads them from the release. It signs with the `DEV_KEY` repository secret, a CI key that registry authorizes to publish this package.

- Keep `version` a quoted string literal; the workflow reads it from the file's text.
- A published version is never rebuilt, so a wrapper-only change that should reach users bumps the revision after the colon (`0.107.79:1` → `0.107.79:2`).
- The **Release** workflow still builds and publishes the same way when a `v*.*` tag is pushed by hand. The tag pushed by Tag and Release doesn't trigger it.
