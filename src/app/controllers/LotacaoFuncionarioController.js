import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class LotacaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_lotacoes_funcionarios';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdUA');
        table.string('NomeUA', 200);
        table.dateTime('DataInicio');
        table.dateTime('DataFim');
        table.string('NomeFuncionario', 200);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/administracao/funcionarios_lotacoes.xml');

      const { HistoricoFuncionariosLotacoes } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const lotacoes = HistoricoFuncionariosLotacoes.LotacaoFuncionario.map(item => {
        const [IdUA] = item.IdUA || '';
        const [NomeUA] = item.NomeUA || '';
        const [DataInicio] = item.DataInicio || '';
        const [DataFim] = item.DataFim || '';
        const [NomeFuncionario] = item.NomeFuncionario || '';
        return {
          IdUA,
          NomeUA,
          DataInicio,
          DataFim,
          NomeFuncionario,
        };
      });

      let lote = [];
      for (const lotacao of lotacoes) {
        lote.push(lotacao);

        if (lote.length === 50) {
          // eslint-disable-next-line no-await-in-loop
          await knex.insert(lote).into(tableName);
          lote = [];
        }
      }

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new LotacaoController();
