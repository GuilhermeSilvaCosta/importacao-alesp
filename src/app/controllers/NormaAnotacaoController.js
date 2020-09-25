import fs from 'fs';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class NormaController {
  async import(req, res) {
    try {
      const tableName = 'alesp_normas_anotacoes';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdNorma');
        table.integer('NumNormaRel');
        table.dateTime('DataNormaRel');
        table.integer('TipoNormaRel')
          .references('IdTipo')
          .inTable('alesp_tipo_normas');
        table.string('DsRel', 2000);
        table.string('DsOrigem', 2000);
        table.integer('IdTipoRel');
        table.string('NumComplNormaRel', 50);
      });

      const data = fs
        .readFileSync('./src/xmls/legislacao_norma_anotacoes.xml');

      const { NormaAnotacoes } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const normas = NormaAnotacoes.NormaAnotacao.map(item => {
        const [IdNorma] = item.IdNorma || '';
        const [NumNormaRel] = item.NumNormaRel || '';
        const [DataNormaRel] = item.DataNormaRel || '';
        const [TipoNormaRel] = item.TipoNormaRel || '';
        const [DsRel] = item.DsRel || '';
        const [DsOrigem] = item.DsOrigem || '';
        const [IdTipoRel] = item.IdTipoRel || '';
        const [NumComplNormaRel] = item.NumComplNormaRel || '';
        return {
          IdNorma,
          NumNormaRel,
          DataNormaRel,
          TipoNormaRel,
          DsRel,
          DsOrigem,
          IdTipoRel,
          NumComplNormaRel,
        };
      });

      let lote = [];
      for (const norma of normas) {
        lote.push(norma);

        if (lote.length === 50) {
          // eslint-disable-next-line no-await-in-loop
          await knex.insert(lote).into(tableName);
          lote = [];
        }
      }

      // await knex.insert(normas).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new NormaController();
