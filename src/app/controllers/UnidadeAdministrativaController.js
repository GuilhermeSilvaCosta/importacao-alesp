import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class UnidadeAdministrativaController {
  async import(req, res) {
    try {
      const tableName = 'alesp_unidades_administrativas';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdUA').notNullable().primary();
        table.integer('IdUAPai');
        table.string('NomeUA', 200);
        table.string('NomeOficialUA', 200);
        table.integer('IdSEFAZ');
        table.dateTime('DataInativacao');
        table.string('EmailResponsavel', 200);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/administracao/uas.xml');

      const { UAs } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const uas = UAs.UA.map(item => {
        const [IdUA] = item.IdUA;
        const [IdUAPai] = item.IdUAPai || '';
        const [NomeUA] = item.NomeUA || '';
        const [NomeOficialUA] = item.NomeOficialUA || '';
        const [IdSEFAZ] = item.IdSEFAZ || '';
        const [DataInativacao] = item.DataInativacao || '';
        const [EmailResponsavel] = item.EmailResponsavel || '';
        return {
          IdUA,
          IdUAPai,
          NomeUA,
          NomeOficialUA,
          IdSEFAZ,
          DataInativacao,
          EmailResponsavel,
        };
      });

      await knex.insert(uas).into(tableName);

      res.json({ message: 'Dados importados com succeso' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new UnidadeAdministrativaController();
