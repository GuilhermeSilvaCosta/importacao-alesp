import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class AreaAtuacaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_areas_atuacao';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('Id').notNullable().primary();
        table.string('Nome', 100);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/deputados/areas_atuacao.xml');

      const { AreasAtuacao } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const areasAtuacao = AreasAtuacao.AreaAtuacao.map(item => {
        const [Id] = item.Id;
        const [Nome] = item.Nome;
        return { Id, Nome };
      });

      const ids = await knex.insert(areasAtuacao).into(tableName);

      res.json(ids);
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new AreaAtuacaoController();
