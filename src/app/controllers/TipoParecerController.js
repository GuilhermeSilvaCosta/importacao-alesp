import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class TipoParecerController {
  async import(req, res) {
    try {
      const tableName = 'alesp_tipos_parecer';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdTipoParcer').notNullable().primary();
        table.string('TipoParecer', 300);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/tipo_parecer.xml');

      const {
        tipos_parecer: tiposParecer,
      } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const tipos = tiposParecer.TipoParecer.map(item => {
        const [IdTipoParcer] = item.IdTipoParcer;
        const [TipoParecer] = item.TipoParecer;
        return { IdTipoParcer, TipoParecer };
      });

      await knex.insert(tipos).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new TipoParecerController();
