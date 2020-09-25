import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class Cargo {
  async import(req, res) {
    try {
      const tableName = 'alesp_cargos';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.dateTime('DataInicio');
        table.dateTime('DataFim');
        table.integer('IdCargo');
        table.string('NomeCargo', 200);
        table.string('NomeFuncionario', 200);
        table.integer('IdRegime');
        table.string('NomeRegime', 200);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/administracao/funcionarios_cargos.xml');

      const { HistoricoFuncionariosCargos } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const cargos = HistoricoFuncionariosCargos.CargoFuncionario.map(item => {
        const [DataInicio] = item.DataInicio;
        const [DataFim] = item.DataFim || '';
        const [IdCargo] = item.IdCargo || '';
        const [NomeCargo] = item.NomeCargo || '';
        const [NomeFuncionario] = item.NomeFuncionario || '';
        const [IdRegime] = item.IdRegime || '';
        const [NomeRegime] = item.NomeRegime || '';
        return {
          DataInicio,
          DataFim,
          IdCargo,
          NomeCargo,
          NomeFuncionario,
          IdRegime,
          NomeRegime,
        };
      });

      let lote = [];
      for (const cargo of cargos) {
        lote.push(cargo);

        if (lote.length === 50) {
          // eslint-disable-next-line no-await-in-loop
          await knex.insert(lote).into(tableName);
          lote = [];
        }
      }

      // await knex.insert(cargos).into(tableName);

      res.json({ message: 'Dados importados com succeso' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new Cargo();
