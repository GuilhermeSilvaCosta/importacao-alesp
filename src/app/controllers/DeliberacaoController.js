import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class DeliberacaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_deliberacoes';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdReuniao');
        table.integer('IdDocumento');
        table.integer('IdPauta');
        table.integer('NrOrdem');
        table.dateTime('DataInclusao');
        table.dateTime('DataSaida');
        table.string('Deliberacao', 5000);
        table.integer('IdDeliberacao');
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/comissoes_permanentes_deliberacoes.xml');

      const { ComissoesReunioesDeliberacoes } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const deliberacoes = ComissoesReunioesDeliberacoes.ReuniaoComissaoDeliberacao.map(item => {
        const [IdReuniao] = item.IdReuniao;
        const [IdDocumento] = item.IdDocumento;
        const [IdPauta] = item.IdPauta;
        const [NrOrdem] = item.NrOrdem;
        const [DataInclusao] = item.DataInclusao || '';
        const [DataSaida] = item.DataSaida || '';
        const [Deliberacao] = item.Deliberacao || '';
        const [IdDeliberacao] = item.IdDeliberacao;
        return {
          IdReuniao,
          IdDocumento,
          IdPauta,
          NrOrdem,
          DataInclusao,
          DataSaida,
          Deliberacao,
          IdDeliberacao,
        };
      });

      await knex.insert(deliberacoes).into(tableName);

      res.json({ message: 'Dados importados com succeso' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new DeliberacaoController();
