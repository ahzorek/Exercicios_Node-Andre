import { readFile } from 'fs/promises';
import { app, parseCSVData } from './server';

app.get("/first_load", async (req, res) => {
  // console.log(req.query.elec_code)
  try {
    const data = await readFile(
      `urna_config/config_${req.query.elec_code}.csv`,
      'utf-8'
    );

    const options = parseCSVData(data);

    res.status(200).json(options);

  } catch (error) {
    console.error('Erro ao ler o arquivo:', error);
    res.status(500).json({ error: 'Erro ao ler o arquivo.' });
  }
});
