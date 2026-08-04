require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CACHE_FILE = path.join(__dirname, 'cache.json');

app.use(express.static('public'));

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function actualizarDatos() {
  try {
    console.log('🔄 Consultando Google Sheets...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: process.env.SHEET_RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('La hoja no retornó datos.');
    }

    const payload = {
      timestamp: new Date().toISOString(),
      status: 'ok',
      data: rows,
    };

    fs.writeFileSync(CACHE_FILE, JSON.stringify(payload, null, 2));
    console.log('✅ Caché actualizada a las:', payload.timestamp);
    return payload;

  } catch (error) {
    console.error('❌ Error al consultar Sheets:', error.message);
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      cacheData.status = 'warning';
      cacheData.errorMessage = 'No se pudo conectar a Google Sheets. Mostrando datos en caché.';
      return cacheData;
    }
    return { status: 'error', message: 'Sin datos disponibles.', data: [] };
  }
}

cron.schedule('*/30 * * * *', async () => {
  console.log('⏰ Ejecutando actualización programada...');
  await actualizarDatos();
});

app.get('/api/datos', async (req, res) => {
  if (fs.existsSync(CACHE_FILE)) {
    return res.json(JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')));
  }
  const datosFrescos = await actualizarDatos();
  res.json(datosFrescos);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
  actualizarDatos();
});