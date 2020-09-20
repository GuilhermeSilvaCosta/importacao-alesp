import xml2js from 'xml2js';
import fs from 'fs';
import knex from '../../database/connection';

class ProposituraController {
  async import(req, res) {
    try {
      const tableName = 'alesp_proposituras';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdDocumento').notNullable().primary();
        table.string('CodOriginalidade', 50);
        table.string('Ementa', 5000);
        table.integer('NroLegislativo');
        table.integer('AnoLegislativo');
        table.integer('IdNatureza')
          .references('IdNatureza')
          .inTable('alesp_naturezas');
        table.dateTime('DtEntradaSistema');
        table.dateTime('DtPublicacao');
      });

      const data = fs
        .readFileSync('./src/xmls/proposituras.xml');

      const {
        proposituras,
      } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const tipos = proposituras.propositura.map(item => {
        const [IdDocumento] = item.IdDocumento;
        const [CodOriginalidade] = item.CodOriginalidade || '';
        const [Ementa] = item.Ementa || '';
        const [NroLegislativo] = item.NroLegislativo || '';
        const [AnoLegislativo] = item.AnoLegislativo || '';
        const [IdNatureza] = item.IdNatureza || '';
        const [DtEntradaSistema] = item.DtEntradaSistema || '';
        const [DtPublicacao] = item.DtPublicacao || '';
        return {
          IdDocumento,
          CodOriginalidade,
          Ementa,
          NroLegislativo,
          AnoLegislativo,
          IdNatureza,
          DtEntradaSistema,
          DtPublicacao,
        };
      });

      await knex.insert(tipos).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new ProposituraController();
