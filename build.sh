#!/usr/bin/env bash
# Builds both languages. Two configs rather than one: mkdocs-shadcn has no
# content i18n — its own i18n is gettext for the theme's UI strings — so each
# language is its own docs_dir and its own site_dir, joined by the language
# link in the top bar.
set -euo pipefail
cd "$(dirname "$0")"

MKDOCS="${MKDOCS:-venv/bin/mkdocs}"
PYTHON="${PYTHON:-venv/bin/python}"

# The theme reads gettext catalogues from its own package directory and ships
# fr and pt only. Ours are installed there on every build, so a reinstalled
# venv cannot silently fall back to English.
if command -v msgfmt >/dev/null 2>&1; then
  theme_locales="$("$PYTHON" -c 'import pathlib, shadcn; print(pathlib.Path(shadcn.__file__).parent / "locales")')"
  for po in locales/*/LC_MESSAGES/messages.po; do
    lang="$(basename "$(dirname "$(dirname "$po")")")"
    mkdir -p "$theme_locales/$lang/LC_MESSAGES"
    msgfmt -o "$theme_locales/$lang/LC_MESSAGES/messages.mo" "$po"
    echo "locale: $lang -> $theme_locales/$lang"
  done
else
  echo "warning: msgfmt not found — theme UI will fall back to English" >&2
fi

for lang in fi en; do
  # mkdocs cannot read outside its docs_dir, so the shared readout is copied
  # in rather than referenced. Regenerated every build; git-ignored.
  rm -rf "docs/$lang/assets"
  mkdir -p "docs/$lang/assets"
  cp -r shared/js shared/css shared/img "docs/$lang/assets/"
  "$MKDOCS" build --strict -q -f "mkdocs.$lang.yml"

  # The theme hardcodes <html lang="en"> in main.html and theme.locale does
  # not reach it, so the Finnish build would declare itself English to screen
  # readers and crawlers. Rewriting the built output beats forking a 160-line
  # template that would drift on the next theme release. No-op for en.
  if [ "$lang" != "en" ]; then
    find "site/$lang" -name '*.html' -exec \
      sed -i "s|<html lang=\"en\">|<html lang=\"$lang\">|" {} +
  fi

  echo "built: site/$lang"
done
