import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class ComissaoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_comissoes_membros';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdComissao')
          .references('IdComissao')
          .inTable('alesp_comissoes');
        table.string('SiglaComissao', 15);
        table.integer('IdMembro');
        table.string('NomeMembro', 150);
        table.integer('IdPapel');
        table.string('Papel', 80);
        table.string('Efetivo', 1);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/comissoes_membros.xml');

      const { ComissoesMembros } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const comissoes = ComissoesMembros.MembroComissao.map(item => {
        const [IdComissao] = item.IdComissao;
        const [SiglaComissao] = item.SiglaComissao;
        const [IdMembro] = item.IdMembro;
        const [NomeMembro] = item.NomeMembro;
        const [IdPapel] = item.IdPapel;
        const [Papel] = item.Papel;
        const [Efetivo] = item.Efetivo;
        return {
          IdComissao, SiglaComissao, IdMembro, NomeMembro, IdPapel, Papel, Efetivo,
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
