#!/bin/bash
# Script para subir automáticamente los cambios a GitHub en macOS

# Ir al directorio donde se encuentra este archivo command
cd "$(dirname "$0")"

echo "--------------------------------------------------------"
echo "  SUBIENDO ACTUALIZACIONES - HUELLAS EN EL AIRE"
echo "--------------------------------------------------------"
echo ""

# Intentar hacer git push
git push

echo ""
echo "--------------------------------------------------------"
echo "¡Listo! Si no hubo errores, tus cambios se están"
echo "publicando en producción en este momento en GitHub."
echo "--------------------------------------------------------"
echo ""

# Esperar para que el usuario pueda ver el resultado antes de cerrar la ventana
read -p "Presiona [Enter] para cerrar esta ventana..."
