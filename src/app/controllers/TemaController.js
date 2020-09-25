import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class TemaController {
  async import(req, res) {
    try {
      const tableName = 'alesp_temas';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdTema').primary();
        table.string('Tema', 100);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/legislacao/legislacao_temas.xml');

      const { Temas } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const temas = Temas.Tema.map(item => {
        const [IdTema] = item.IdTema || '';
        const [Tema] = item.Tema || '';
        return {
          IdTema,
          Tema,
        };
      });

      await knex.insert(temas).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new TemaController();
