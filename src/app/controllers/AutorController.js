import xml2js from 'xml2js';
import fs from 'fs';
import knex from '../../database/connection';

class AutorController {
  async import(req, res) {
    try {
      const tableName = 'alesp_autores';

      /* await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdAutor');
        table.integer('IdDocumento');
        table.string('NomeAutor', 200);
      }); */

      const data = fs
        .readFileSync('./src/xmls/documento_autor.xml');

      const { documentos_autores: DocumentosAutores } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const autores = DocumentosAutores.DocumentoAutor.map(item => {
        const [IdAutor] = item.IdAutor;
        const [IdDocumento] = item.IdDocumento || '';
        const [NomeAutor] = item.NomeAutor || '';
        return {
          IdAutor,
          IdDocumento,
          NomeAutor,
        };
      });

      const filterautores = autores.filter((item, index) => index >= 543960);

      let lote = [];
      for (const autor of filterautores) {
        lote.push(autor);

        if (lote.length === 50) {
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

export default new AutorController();
