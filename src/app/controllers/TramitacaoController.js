import xml2js from 'xml2js';
import fs from 'fs';
import knex from '../../database/connection';

class TramitacaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_tranmitacoes';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdDocumento');
        table.dateTime('Data');
        table.integer('NrOrdem');
        table.string('Descricao', 5000);
        table.integer('IdTpAndamento');
        table.string('TpAndamento', 35);
        table.integer('IdEtapa');
        table.string('NmEtapa', 35);
        table.integer('IdComissao');
        table.string('SiglaComissao', 25);
      });

      const files = [
        './src/xmls/documento_andamento_atual.xml',
        './src/xmls/documento_andamento.xml',
      ];
      for (const file of files) {
        console.log(file);
        let data;
        const stream = fs.createReadStream(file);
        stream.on('data', d => {
          if (!data) data = '';
          data = data.concat(d.toString());
        });
        stream.on('end', async () => {
          try {
            const { documentos_andamentos: DocumentosAndamentos } = await xml2js
              .parseStringPromise(data, { mergeAttrs: true });
            const documentos = DocumentosAndamentos.DocumentoAndamento.map(item => {
              const [IdDocumento] = item.IdDocumento;
              const [Data] = item.Data || '';
              const [NrOrdem] = item.NrOrdem || '';
              const [Descricao] = item.Descricao || '';
              const [IdTpAndamento] = item.IdTpAndamento || '';
              const [TpAndamento] = item.TpAndamento || '';
              const [IdEtapa] = item.IdEtapa || '';
              const [NmEtapa] = item.NmEtapa || '';
              const [IdComissao] = item.IdComissao || '';
              const [SiglaComissao] = item.SiglaComissao || '';
              return {
                IdDocumento,
                Data,
                NrOrdem,
                Descricao,
                IdTpAndamento,
                TpAndamento,
                IdEtapa,
                NmEtapa,
                IdComissao,
                SiglaComissao,
              };
            });

            let lote = [];
            for (const documento of documentos) {
              lote.push(documento);

              if (lote.length === 30) {
                // eslint-disable-next-line no-await-in-loop
                await knex.insert(lote).into(tableName);
                lote = [];
              }
            }

            // await knex.insert(propositurasSerialized).into(tableName);

            res.json({ message: 'Dados importados com sucesso!' });
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
        });
      }
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new TramitacaoController();
