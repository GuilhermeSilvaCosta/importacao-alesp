import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class VotacaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_votacoes';

      /* await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdReuniao');
        table.integer('IdComissao')
          .references('IdComissao')
          .inTable('alesp_comissoes');
        table.integer('IdPauta');
        table.integer('IdDocumento');
        table.integer('IdDeputado');
        table.string('Deputado', 200);
        table.string('TipoVoto', 1);
        table.string('Voto', 25);
      }); */

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/comissoes_permanentes_votacoes.xml');

      const { ComissoesReunioesVotacao } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const votacoes = ComissoesReunioesVotacao.ReuniaoComissaoVotacao.map(item => {
        const [IdReuniao] = item.IdReuniao;
        const [IdComissao] = item.IdComissao;
        const [IdPauta] = item.IdPauta || '';
        const [IdDocumento] = item.IdDocumento || '';
        const [IdDeputado] = item.IdDeputado || '';
        const [Deputado] = item.Deputado || '';
        const [TipoVoto] = item.TipoVoto || '';
        const [Voto] = item.Voto || '';
        return {
          IdReuniao,
          IdComissao,
          IdPauta,
          IdDocumento,
          IdDeputado,
          Deputado,
          TipoVoto,
          Voto,
        };
      });

      const filteredVotacao = votacoes.filter((item, index) => index >= 16395);

      let lote = [];
      for (const votacao of filteredVotacao) {
        lote.push(votacao);

        if (lote.length === 30) {
          // eslint-disable-next-line no-await-in-loop
          await knex.insert(lote).into(tableName);
          lote = [];
        }
      }

      // await knex.insert(votacoes).into(tableName);

      res.json({ message: 'Dados importados com succeso' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new VotacaoController();
