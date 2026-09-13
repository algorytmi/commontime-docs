#!/usr/bin/env bash
# Builds both languages. Two configs rather than one: mkdocs-shadcn has no
# content i18n — its own i18n is gettext for the theme's UI strings — so each
# language is its own docs_dir and its own site_dir, joined by the language
# link in the top bar.
set -euo pipefail
cd "$(dirname "$0")"

MKDOCS="${MKDOCS:-venv/bin/mkdocs}"

for lang in fi en; do
  # mkdocs cannot read outside its docs_dir, so the shared readout is copied
  # in rather than referenced. Regenerated every build; git-ignored.
  rm -rf "docs/$lang/assets"
  mkdir -p "docs/$lang/assets"
  cp -r shared/js shared/css "docs/$lang/assets/"
  "$MKDOCS" build --strict -q -f "mkdocs.$lang.yml"
  echo "built: site/$lang"
done
