import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class TipoNormaController {
  async import(req, res) {
    try {
      const tableName = 'alesp_tipo_normas';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdTipo').primary();
        table.string('DsTipo', 100);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/legislacao/legislacao_tipo_normas.xml');

      const { TipoNormas } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const tipoNormas = TipoNormas.TipoNorma.map(item => {
        const [IdTipo] = item.IdTipo || '';
        const [DsTipo] = item.DsTipo || '';
        return {
          IdTipo,
          DsTipo,
        };
      });

      await knex.insert(tipoNormas).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new TipoNormaController();
