import xml2js from 'xml2js';
import fs from 'fs';
import knex from '../../database/connection';

class RegimeTranmitacaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_documento_regime';

      /*  await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdDocumento');
        table.integer('IdRegime');
        table.string('NomeRegime', 200);
        table.dateTime('DataInicio');
        table.dateTime('DataFim');
      }); */

      const data = fs
        .readFileSync('./src/xmls/documento_regime.xml');

      const { documentos_regimes: DocumentosRegimes } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const documentosRegime = DocumentosRegimes.DocumentoRegime.map(item => {
        const [IdDocumento] = item.IdDocumento;
        const [IdRegime] = item.IdRegime || '';
        const [NomeRegime] = item.NomeRegime || '';
        const [DataInicio] = item.DataInicio || '';
        const [DataFim] = item.DataFim || '';
        return {
          IdDocumento,
          IdRegime,
          NomeRegime,
          DataInicio,
          DataFim,
        };
      });

      const filterDocumentosRegime = documentosRegime.filter((item, index) => index >= 96870);

      let lote = [];
      for (const documentoRegime of filterDocumentosRegime) {
        lote.push(documentoRegime);

        if (lote.length === 30) {
          // eslint-disable-next-line no-await-in-loop
          await knex.insert(lote).into(tableName);
          lote = [];
        }
      }

      // await knex.insert(propositurasSerialized).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new RegimeTranmitacaoController();
