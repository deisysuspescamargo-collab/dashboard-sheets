# Dashboard de Ventas con Google Sheets API

## Descripción
Aplicación web interactiva que consume datos en tiempo real desde Google Sheets mediante su API oficial, implementando un sistema de caché con actualización programada (Cron Job) y un panel visual moderno con Chart.js y Tailwind CSS.

## Tecnologías Utilizadas
* **Backend:** Node.js, Express, googleapis, node-cron
* **Frontend:** HTML5, Tailwind CSS, Chart.js, FontAwesome
* **Base de datos / Origen:** Google Sheets API v4

## Características
* Consumo automatizado de datos desde Google Sheets.
* Tarea programada (Cron) para refrescar datos en caché cada 30 minutos.
* Visualización interactiva mediante gráficos de barras y distribución por dona.
* Métricas principales (KPIs) e historial de transacciones.
