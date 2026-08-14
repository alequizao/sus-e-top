#!/bin/bash
# SUS É TOP — publica uma nova versão e FORÇA a atualização em todos os usuários.
# uso:  ./bump.sh 7.2.0
set -e
cd "$(dirname "$0")"

V="$1"
[ -z "$V" ] && { echo "uso: ./bump.sh <versao>   ex: ./bump.sh 7.2.0"; exit 1; }
Q="${V//./}"

sed -i -E "s/\?v=[0-9]+/?v=$Q/g" ./*.html sw.js manifest.json
sed -i -E "s/const VERSAO = 'sus-e-top-v[^']*'/const VERSAO = 'sus-e-top-v$V'/" sw.js
sed -i -E "s/APP_VERSAO = '[^']*'/APP_VERSAO = '$V'/" assets/versao.js
sed -i -E "s/APP_VERSAO_DATA = '[^']*'/APP_VERSAO_DATA = '$(date +%F)'/" assets/versao.js

echo "publicado: v$V (assets ?v=$Q, cache sus-e-top-v$V)"
echo "quem já usa o app recebe a atualização na próxima abertura."
