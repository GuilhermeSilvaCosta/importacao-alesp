import axios from 'axios';
import xml2js from 'xml2js';
import fs from 'fs';
import knex from '../../database/connection';

class TipoParecerController {
  async import(req, res) {
    try {
      const tableName = 'alesp_tipos_parecer';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdTipoParcer').notNullable().primary();
        table.string('TipoParecer', 300);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/processo_legislativo/tipo_parecer.xml');

      const {
        tipos_parecer: tiposParecer,
      } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const tipos = tiposParecer.TipoParecer.map(item => {
        const [IdTipoParcer] = item.IdTipoParcer;
        const [TipoParecer] = item.TipoParecer;
        return { IdTipoParcer, TipoParecer };
      });

      await knex.insert(tipos).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }

  async importPropositura(req, res) {
    try {
      const tableName = 'alesp_propositura_parecer';
      /*
      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdParecer');
        table.integer('IdDocumento');
        table.integer('IdTipoParecer')
          .references('IdTipoParcer')
          .inTable('alesp_tipos_parecer');
        table.string('TipoParecer', 300);
        table.string('TpParecer', 1);
        table.string('Descricao', 400);
        table.integer('NrParecer');
        table.integer('AnoParecer');
        table.integer('IdComissao')
          .references('IdComissao')
          .inTable('alesp_comissoes');
        table.string('SiglaComissao', 15);
        table.string('VotoVencido', 1);
        table.string('RelatorEspecial', 1);
        table.string('AdReferendum', 1);
        table.dateTime('Data');
        table.string('URL', 300);
      }); */

      const data = fs
        .readFileSync('./src/xmls/propositura_parecer.xml');

      const {
        pareceres,
      } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const pareceresSerialized = pareceres.ProposituraParecerComissao.map(item => {
        const [IdParecer] = item.IdParecer;
        const [IdDocumento] = item.IdDocumento || '';
        const [IdTipoParecer] = item.IdTipoParecer || '';
        const [TipoParecer] = item.TipoParecer || '';
        const [TpParecer] = item.TpParecer || '';
        const [Descricao] = item.Descricao || '';
        const [NrParecer] = item.NrParecer || '';
        const [AnoParecer] = item.AnoParecer || '';
        const [IdComissao] = item.IdComissao || '';
        const [SiglaComissao] = item.SiglaComissao || '';
        const [VotoVencido] = item.VotoVencido || '';
        const [RelatorEspecial] = item.RelatorEspecial || '';
        const [AdReferendum] = item.AdReferendum || '';
        const [Data] = item.Data || '';
        const [URL] = item.URL || '';
        return {
          IdParecer,
          IdDocumento,
          IdTipoParecer,
          TipoParecer,
          TpParecer,
          Descricao,
          NrParecer,
          AnoParecer,
          IdComissao,
          SiglaComissao,
          VotoVencido,
          RelatorEspecial,
          AdReferendum,
          Data,
          URL,
        };
      });

      const filterPareceres = pareceresSerialized.filter((item, index) => index >= 40590);

      let lote = [];
      for (const parecer of filterPareceres) {
        lote.push(parecer);

        if (lote.length === 30) {
          // eslint-disable-next-line no-await-in-loop
          await knex.insert(lote).into(tableName);
          lote = [];
        }
      }

      // await knex.insert(propositurasSerialized).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new TipoParecerController();
