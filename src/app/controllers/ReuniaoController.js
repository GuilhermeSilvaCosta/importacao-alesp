import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class ReuniaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_reunioes';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdReuniao').notNullable().primary();
        table.integer('IdComissao')
          .references('IdComissao')
          .inTable('alesp_comissoes');
        table.integer('IdPauta');
        table.integer('NrLegislatura');
        table.string('NrConvocacao', 30);
        table.string('TipoConvocacao', 1);
        table.dateTime('Data');
        table.string('CodSituacao', 1);
        table.string('Situacao', 25);
        table.string('Presidente', 200);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/comissoes_permanentes_reunioes.xml');

      const { ComissoesReunioes } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const reunioes = ComissoesReunioes.ReuniaoComissao.map(item => {
        const [IdReuniao] = item.IdReuniao;
        const [IdComissao] = item.IdComissao;
        const [IdPauta] = item.IdPauta || '';
        const [NrLegislatura] = item.NrLegislatura || '';
        const [NrConvocacao] = item.NrConvocacao || '';
        const [TipoConvocacao] = item.TipoConvocacao || '';
        const [Data] = item.Data || '';
        const [CodSituacao] = item.CodSituacao || '';
        const [Situacao] = item.Situacao || '';
        const [Presidente] = item.Presidente || '';
        return {
          IdReuniao,
          IdComissao,
          IdPauta,
          NrLegislatura,
          NrConvocacao,
          TipoConvocacao,
          Data,
          CodSituacao,
          Situacao,
          Presidente,
        };
      });

      await knex.insert(reunioes).into(tableName);

      res.json({ message: 'Dados importados com succeso' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new ReuniaoController();
