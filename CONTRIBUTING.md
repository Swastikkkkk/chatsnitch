# Contributing

Thanks for helping. ChatSnitch stays small on purpose, so a few ground rules:

- **No new permissions.** The extension ships with `management` only. PRs that add host access, network access, or remote code won't be merged.
- **No dependencies or build step in `extension/`.** People should be able to read every line before installing.
- **Add a test** in `tests/` for any change to `extension/analyze.js`. Real Chrome warning strings are best.

## Good places to start

- Chrome's permission warning text in other languages (see `hostsFromWarnings` in `analyze.js`)
- New AI chat domains in `AI_SITES`
- False positives or misses: open an issue with the extension's name and the warnings Chrome shows for it

## Running it

```bash
npm test
```

Load `extension/` via `chrome://extensions` → Developer mode → Load unpacked.
