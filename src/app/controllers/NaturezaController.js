import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class DespesaController {
  async import(req, res) {
    try {
      const tableName = 'alesp_naturezas';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdNatureza').notNullable().primary();
        table.string('NmNatureza', 200);
        table.string('SgNatureza', 35);
        table.string('TpNatureza', 35);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/naturezasSpl.xml');

      const { natureza } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const naturezas = natureza.natureza.map(item => {
        const [IdNatureza] = item.idNatureza;
        const [NmNatureza] = item.nmNatureza || '';
        const [SgNatureza] = item.sgNatureza || '';
        const [TpNatureza] = item.tpNatureza || '';
        return {
          IdNatureza, NmNatureza, SgNatureza, TpNatureza,
        };
      });

      await knex.insert(naturezas).into(tableName);

      res.json({ message: 'Dados importados com succeso' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new DespesaController();
