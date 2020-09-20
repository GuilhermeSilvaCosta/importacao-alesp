import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class ComissaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_comissoes';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdComissao').notNullable().primary();
        table.string('SiglaComissao', 15);
        table.string('NomeComissao', 300);
        table.string('DescricaoComissao', 1000);
        table.datetime('DataFimComissao');
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/comissoes.xml');

      const { Comissoes } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const comissoes = Comissoes.Comissao.map(item => {
        const [IdComissao] = item.IdComissao;
        const [SiglaComissao] = item.SiglaComissao || '';
        const [NomeComissao] = item.NomeComissao || '';
        const [DescricaoComissao] = item.DescricaoComissao || '';
        const [DataFimComissao] = item.DataFimComissao || '';
        return {
          IdComissao, SiglaComissao, NomeComissao, DescricaoComissao, DataFimComissao,
        };
      });

      await knex.insert(comissoes).into(tableName);

      res.json({ message: 'Dados importados com succeso' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new ComissaoController();
