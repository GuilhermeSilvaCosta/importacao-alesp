import fs from 'fs';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class NormaController {
  async import(req, res) {
    try {
      const tableName = 'alesp_normas';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdNorma');
        table.integer('Numero');
        table.integer('Ano');
        table.integer('IdTipo')
          .references('IdTipo')
          .inTable('alesp_tipo_normas');
        table.dateTime('Data');
        table.string('Situacao', 1);
        table.string('Ementa', 2000);
        table.string('Autores', 2000);
        table.string('CadDO', 200);
        table.integer('PagDO');
        table.string('DataDO', 50);
        table.string('URLDO', 500);
        table.string('URLFicha', 500);
        table.string('URLIntegra', 500);
        table.string('URLCompilado', 500);
        table.string('Promulg', 1);
        table.string('Ambito', 1);
        table.string('Index', 100);
        table.integer('IdTema');
        table.integer('IdSubTema');
        table.string('NumCompl', 50);
      });

      const data = fs
        .readFileSync('./src/xmls/legislacao_normas.xml');

      const { Normas } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const normas = Normas.LegislacaoNorma.map(item => {
        const [IdNorma] = item.IdNorma || '';
        const [Numero] = item.Numero || '';
        const [Ano] = item.Ano || '';
        const [IdTipo] = item.IdTipo || '';
        const [Data] = item.Data || '';
        const [Situacao] = item.Situacao || '';
        const [Ementa] = item.Ementa || '';
        const [Autores] = item.Autores || '';
        const [CadDO] = item.CadDO || '';
        const [PagDO] = item.PagDO || '';
        const [DataDO] = item.DataDO || '';
        const [URLDO] = item.URLDO || '';
        const [URLFicha] = item.URLFicha || '';
        const [URLIntegra] = item.URLIntegra || '';
        const [URLCompilado] = item.URLCompilado || '';
        const [Promulg] = item.Promulg || '';
        const [Ambito] = item.Ambito || '';
        const [Index] = item.Index || '';
        const [IdTema] = item.IdTema || '';
        const [IdSubTema] = item.IdSubTema || '';
        const [NumCompl] = item.NumCompl || '';
        return {
          IdNorma,
          Numero,
          Ano,
          IdTipo,
          Data,
          Situacao,
          Ementa,
          Autores,
          CadDO,
          PagDO,
          DataDO,
          URLDO,
          URLFicha,
          URLIntegra,
          URLCompilado,
          Promulg,
          Ambito,
          Index,
          IdTema,
          IdSubTema,
          NumCompl,
        };
      });

      let lote = [];
      for (const norma of normas) {
        lote.push(norma);

        if (lote.length === 50) {
          // eslint-disable-next-line no-await-in-loop
          await knex.insert(lote).into(tableName);
          lote = [];
        }
      }

      // await knex.insert(normas).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new NormaController();
