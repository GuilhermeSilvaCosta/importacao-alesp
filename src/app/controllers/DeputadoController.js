import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class DeputadoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_deputados';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdDeputado').notNullable().primary();
        table.string('NomeParlamentar', 100);
        table.string('Aniversario', 5);
        table.string('Partido', 20)
          .references('Sigla')
          .inTable('alesp_partidos');
        table.string('Situacao', 3);
        table.string('Email', 200);
        table.string('Sala', 15);
        table.string('Telefone', 50);
        table.string('PlacaVeiculo', 100);
        table.string('Biografia', 1000);
        table.string('HomePage', 300);
        table.string('Andar', 15);
        table.string('Fax', 50);
        table.integer('Matricula');
        table.integer('IdSPL');
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/deputados/deputados.xml');

      const { Deputados } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const deputados = Deputados.Deputado.map(item => {
        const [IdDeputado] = item.IdDeputado;
        const [NomeParlamentar] = item.NomeParlamentar || '';
        const [Aniversario] = item.Aniversario || '';
        const [Partido] = item.Partido || '';
        const [Situacao] = item.Situacao || '';
        const [Email] = item.Email || '';
        const [Sala] = item.Sala || '';
        const [Telefone] = item.Telefone || '';
        const [PlacaVeiculo] = item.PlacaVeiculo || '';
        const [Biografia] = item.Biografia || '';
        const [HomePage] = item.HomePage || '';
        const [Andar] = item.Andar || '';
        const [Fax] = item.Fax || '';
        const [Matricula] = item.Matricula || '';
        const [IdSPL] = item.IdSPL || '';
        return {
          IdDeputado,
          NomeParlamentar,
          Aniversario,
          Partido,
          Situacao,
          Email,
          Sala,
          Telefone,
          PlacaVeiculo,
          Biografia,
          HomePage,
          Andar,
          Fax,
          Matricula,
          IdSPL,
        };
      });

      await knex.insert(deputados).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }

  async importAreaAtuacao(req, res) {
    try {
      const tableName = 'alesp_deputado_area_atuacao';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdArea')
          .notNullable()
          .references('Id')
          .inTable('alesp_areas_atuacao');

        table.integer('IdDeputado')
          .notNullable();

        table.integer('NrOrdem');
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/deputados/deputado_area_atuacao.xml');

      const { DeputadosAreaAtuacao } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const deputadosAreaAtuacao = DeputadosAreaAtuacao.DeputadoAreaAtuacao.map(item => {
        const [IdArea] = item.IdArea;
        const [IdDeputado] = item.IdDeputado;
        const [NrOrdem] = item.NrOrdem;
        return {
          IdArea,
          IdDeputado,
          NrOrdem,
        };
      });

      await knex.insert(deputadosAreaAtuacao).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }

  async importBaseEleitoral(req, res) {
    try {
      const tableName = 'alesp_deputado_base_eleitoral';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdBaseEleitoral')
          .notNullable()
          .references('Id')
          .inTable('alesp_bases_eleitorais');

        table.integer('IdDeputado')
          .notNullable();

        table.integer('NrOrdem');
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/deputados/deputado_base_eleitoral.xml');

      const {
        DeputadosBaseEleitoral,
      } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const deputadoBaseEleitoral = DeputadosBaseEleitoral.DeputadoBaseEleitoral.map(item => {
        const [IdBaseEleitoral] = item.IdBaseEleitoral;
        const [IdDeputado] = item.IdDeputado;
        const [NrOrdem] = item.NrOrdem;
        return {
          IdBaseEleitoral,
          IdDeputado,
          NrOrdem,
        };
      });

      await knex.insert(deputadoBaseEleitoral).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new DeputadoController();
