#!/usr/bin/env bash

# ==============================================================================
# 🧙‍♂️ Verificador de Entrega y Generador de Pull Request (Colegio Mágico)
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}==============================================================================${NC}"
echo -e "${CYAN}🔮 TRIBUNAL MÁGICO: Auditoría Pre-Vuelo para Entrega de Pull Request${NC}"
echo -e "${PURPLE}==============================================================================${NC}\n"

# 1. Verificar Integridad Sagrada (*.spec.ts)
echo -e "${BLUE}🛡️ Paso 1: Verificando que los archivos de prueba no hayan sido alterados...${NC}"
MODIFIED_SPECS=""
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  MODIFIED_SPECS=$(git diff origin/main -- 'src/**/*.spec.ts' 2>/dev/null || true)
fi

if [ -n "$MODIFIED_SPECS" ]; then
  echo -e "${RED}🛑 ¡ALERTA DE MALDICIÓN (CALIFICACIÓN 0.0 INMINENTE)!${NC}"
  echo -e "${RED}Se han detectado modificaciones en archivos sagrados de prueba (*.spec.ts).${NC}"
  echo -e "Ejecuta de inmediato para restaurarlos:"
  echo -e "${YELLOW}  git checkout origin/main -- src/app/**/*.spec.ts${NC}\n"
  exit 1
else
  echo -e "${GREEN}✔ Archivos de prueba limpios e intactos. Integridad garantizada.${NC}\n"
fi

# 2. Verificar rama actual y cambios pendientes
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}🌿 Paso 2: Verificando rama de trabajo y estado de Git...${NC}"
echo -e "Rama actual: ${YELLOW}${CURRENT_BRANCH}${NC}"

if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
  echo -e "${YELLOW}⚠️ Aviso: Estás en la rama principal (${CURRENT_BRANCH}).${NC}"
  echo -e "Se recomienda crear una rama propia para tu entrega: ${CYAN}git checkout -b feature/entrega-[tu-nombre]${NC}\n"
fi

STATUS_OUTPUT=$(git status --porcelain)
if [ -n "$STATUS_OUTPUT" ]; then
  echo -e "${YELLOW}⚠️ Hay cambios sin consagrar (uncommitted changes):${NC}"
  git status -s
  echo -e "Recuerda hacer commit y push antes de abrir el PR:"
  echo -e "${CYAN}  git add . && git commit -m 'feat: tus cambios' && git push origin ${CURRENT_BRANCH}${NC}\n"
else
  echo -e "${GREEN}✔ Árbol de trabajo limpio (No hay cambios pendientes de commit).${NC}\n"
fi

# 3. Detectar repositorio remoto y generar enlace del PR
echo -e "${BLUE}🔗 Paso 3: Generando enlace oficial para crear el Pull Request...${NC}"
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")

# Extraer usuario u organización de GitHub
GH_USER=""
if [[ "$REMOTE_URL" =~ github\.com[:/]([^/]+)/([^/.]+)(\.git)?$ ]]; then
  GH_USER="${BASH_REMATCH[1]}"
  REPO_NAME="${BASH_REMATCH[2]}"
fi

UPSTREAM_REPO="Jhonsebastianas/angular-colegio-magico"

if [ -n "$GH_USER" ]; then
  if [ "$GH_USER" = "Jhonsebastianas" ]; then
    PR_URL="https://github.com/${UPSTREAM_REPO}/compare/main...${CURRENT_BRANCH}?expand=1"
  else
    PR_URL="https://github.com/${UPSTREAM_REPO}/compare/main...${GH_USER}:${CURRENT_BRANCH}?expand=1"
  fi

  echo -e "${GREEN}✨ ¡Enlace directo listo! Abre tu navegador en la siguiente URL:${NC}"
  echo -e "\n  👉 ${CYAN}${PR_URL}${NC}\n"
  echo -e "${YELLOW}Verifica en GitHub que:${NC}"
  echo -e "  - Base repository sea: ${GREEN}${UPSTREAM_REPO}${NC} (rama ${GREEN}main${NC})"
  echo -e "  - En la descripción pegues la ${GREEN}Bitácora de IA (assets/plantilla_bitacora_ia.md)${NC} (20% de tu nota).\n"
else
  echo -e "${YELLOW}No se pudo inferir la URL de GitHub desde el remote origin.${NC}"
  echo -e "Abre manualmente GitHub y compara tu rama contra ${UPSTREAM_REPO} (main).\n"
fi

echo -e "${PURPLE}==============================================================================${NC}"
echo -e "${GREEN}🧙‍♂️ ¡Que la magia de Angular y el Tribunal del PR te acompañen!${NC}"
echo -e "${PURPLE}==============================================================================${NC}"
