import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class PresencaController {
  async import(req, res) {
    try {
      const tableName = 'alesp_comissoes_permanentes_presencas';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdReuniao');
        table.integer('IdPauta');
        table.integer('IdDeputado');
        table.string('Deputado', 200);
        table.integer('IdComissao')
          .references('IdComissao')
          .inTable('alesp_comissoes');
        table.string('SiglaComissao', 25);
        table.dateTime('DataReuniao');
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/comissoes_permanentes_presencas.xml');

      const { ComissoesReunioesPresencas } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const presencas = ComissoesReunioesPresencas.ReuniaoComissaoPresenca.map(item => {
        const [IdReuniao] = item.IdReuniao;
        const [IdPauta] = item.IdPauta;
        const [IdDeputado] = item.IdDeputado;
        const [Deputado] = item.Deputado;
        const [IdComissao] = item.IdComissao;
        const [SiglaComissao] = item.SiglaComissao;
        const [DataReuniao] = item.DataReuniao;
        return {
          IdReuniao,
          IdPauta,
          IdDeputado,
          Deputado,
          IdComissao,
          SiglaComissao,
          DataReuniao,
        };
      });

      await knex.insert(presencas).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new PresencaController();
