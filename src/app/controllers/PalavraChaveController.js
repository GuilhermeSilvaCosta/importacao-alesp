import axios from 'axios';
import xml2js from 'xml2js';
import fs from 'fs';
import knex from '../../database/connection';

class PalavraChaveController {
  async import(req, res) {
    try {
      const tableName = 'alesp_palavras_chave';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdPalavra').notNullable().primary();
        table.string('Palavra', 150);
        table.string('PalavraSemAcento', 150);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/palavras_chave.xml');

      const { palavras_chave: PalavrasChave } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const palavrasChave = PalavrasChave.PalavraChave.map(item => {
        const [IdPalavra] = item.IdPalavra;
        const [Palavra] = item.Palavra || '';
        const [PalavraSemAcento] = item.PalavraSemAcento || '';
        return {
          IdPalavra,
          Palavra,
          PalavraSemAcento,
        };
      });

      await knex.insert(palavrasChave).into(tableName);

      res.json({ message: 'Dados importados com succeso' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }

  async importDocumentos(req, res) {
    try {
      const tableName = 'alesp_documentos_palavra_chave';

      /* await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdDocumento');
        table.integer('IdPalavra');
      }); */

      const data = fs
        .readFileSync('./src/xmls/documento_palavras.xml');

      const { documentos_palavras: DocumentosPalavras } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const documentosPalavras = DocumentosPalavras.DocumentoPalavra.map(item => {
        const [IdDocumento] = item.IdDocumento;
        const [IdPalavra] = item.IdPalavra || '';
        return {
          IdDocumento,
          IdPalavra,
        };
      });

      const documentosFiltered = documentosPalavras.filter((doc, index) => index >= 456100);

      let lote = [];
      for (const documentoPalavra of documentosFiltered) {
        lote.push(documentoPalavra);

        if (lote.length === 100) {
          // eslint-disable-next-line no-await-in-loop
          await knex.insert(lote).into(tableName);
          lote = [];
        }
      }

      // await knex.insert(documentosPalavras).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new PalavraChaveController();
