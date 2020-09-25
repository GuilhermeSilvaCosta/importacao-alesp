import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class LotacaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_lotacoes';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdUA');
        table.integer('IdCargo');
        table.string('NomeUA', 200);
        table.string('NomeCargo', 200);
        table.string('NomeFuncionario', 200);
        table.integer('IdRegime');
        table.string('NomeRegime', 200);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/administracao/lotacoes.xml');

      const { Lotacoes } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const lotacoes = Lotacoes.Lotacao.map(item => {
        const [IdUA] = item.IdUA || '';
        const [IdCargo] = item.IdCargo || '';
        const [NomeUA] = item.NomeUA || '';
        const [NomeCargo] = item.NomeCargo || '';
        const [NomeFuncionario] = item.NomeFuncionario || '';
        const [IdRegime] = item.IdRegime || '';
        const [NomeRegime] = item.NomeRegime || '';
        return {
          IdUA,
          IdCargo,
          NomeUA,
          NomeCargo,
          NomeFuncionario,
          IdRegime,
          NomeRegime,
        };
      });

      await knex.insert(lotacoes).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new LotacaoController();
