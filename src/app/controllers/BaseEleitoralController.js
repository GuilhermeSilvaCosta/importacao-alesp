import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class BaseEleitoralController {
  async import(req, res) {
    try {
      const tableName = 'alesp_bases_eleitorais';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('Id').notNullable().primary();
        table.string('Nome', 300);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/deputados/bases_eleitorais.xml');

      const { BasesEleitorais } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const basesEleitorais = BasesEleitorais.BaseEleitoral.map(item => {
        const [Id] = item.Id;
        const [Nome] = item.Nome;
        return { Id, Nome };
      });

      await knex.insert(basesEleitorais).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new BaseEleitoralController();
