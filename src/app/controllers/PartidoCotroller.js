import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class PartidoCotroller {
  async import(req, res) {
    try {
      const tableName = 'alesp_partidos';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.string('Sigla', 20).notNullable().primary();
        table.integer('Numero').notNullable().unique();
        table.string('Nome', 100);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/deputados/partidos.xml');

      const { Partidos } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const partidos = Partidos.Partido.map(item => {
        const [Nome] = item.Nome;
        const [Numero] = item.Numero;
        const [Sigla] = item.Sigla;
        return { Nome, Numero, Sigla };
      });

      const ids = await knex.insert(partidos).into(tableName);

      res.json(ids);
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new PartidoCotroller();
