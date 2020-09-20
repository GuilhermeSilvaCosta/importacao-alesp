import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class DespesaController {
  async import(req, res) {
    try {
      const tableName = 'alesp_despesas_gabinete';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.string('Deputado', 150);
        table.integer('Matricula');
        table.integer('Ano');
        table.integer('Mes');
        table.string('Tipo', 1);
        table.string('CNPJ', 18);
        table.string('Fornecedor', 200);
        table.decimal('Valor', 20, 2);
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/deputados/despesas_gabinetes.xml');

      const { despesas } = await xml2js.parseStringPromise(data, { mergeAttrs: true });
      const despesasSerialize = despesas.despesa.map(item => {
        const [Deputado] = item.Deputado || '';
        const [Matricula] = item.Matricula || '';
        const [Ano] = item.Ano || '';
        const [Mes] = item.Mes || '';
        const [Tipo] = item.Tipo || '';
        const [CNPJ] = item.CNPJ || '';
        const [Fornecedor] = item.Fornecedor || '';
        const [Valor] = item.Valor || '';
        return {
          Deputado, Matricula, Ano, Mes, Tipo, CNPJ, Fornecedor, Valor,
        };
      });

      const ids = await knex.insert(despesasSerialize).into(tableName);

      res.json(ids);
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new DespesaController();
