import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class SubTemaController {
  async import(req, res) {
    try {
      const tableName = 'alesp_sub_temas';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdSubTema').primary();
        table.string('SubTema', 100);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/legislacao/legislacao_subtemas.xml');

      const { SubTemas } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const subTemas = SubTemas.SubTema.map(item => {
        const [IdSubTema] = item.IdSubTema || '';
        const [SubTema] = item.SubTema || '';
        return {
          IdSubTema,
          SubTema,
        };
      });

      await knex.insert(subTemas).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new SubTemaController();
