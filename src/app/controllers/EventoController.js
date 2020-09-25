import axios from 'axios';
import xml2js from 'xml2js';
import knex from '../../database/connection';

class EventoController {
  async import(req, res) {
    try {
      const tableName = 'alesp_agenda_eventos';

      await knex.schema.dropTableIfExists(tableName);
      await knex.schema.createTable(tableName, table => {
        table.integer('IdEvento');
        table.dateTime('Data');
        table.string('HoraIni', 5);
        table.string('HoraFim', 5);
        table.string('Descricao', 300);
        table.string('Titulo', 100);
        table.string('Obs', 1000);
        table.string('Local', 200);
        table.string('Publico', 100);
        table.string('Solicitante', 100);
        table.string('IdPai', 100);
        table.string('JustCancel', 300);
        table.integer('FlagCancelado');
        table.integer('FlagTransferido');
        table.dateTime('DataTransferido');
        table.integer('FlagProxDia');
        table.dateTime('DataProxDia');
      });

      const { data } = await axios.get('https://www.al.sp.gov.br/repositorioDados/agenda/agenda_eventos.xml');

      const { Eventos } = await xml2js
        .parseStringPromise(data, { mergeAttrs: true });
      const eventos = Eventos.Evento.map(item => {
        const [IdEvento] = item.IdEvento || '';
        const [Data] = item.Data || '';
        const [HoraIni] = item.HoraIni || '';
        const [HoraFim] = item.HoraFim || '';
        const [Descricao] = item.Descricao || '';
        const [Titulo] = item.Titulo || '';
        const [Obs] = item.Obs || '';
        const [Local] = item.Local || '';
        const [Publico] = item.Publico || '';
        const [Solicitante] = item.Solicitante || '';
        const [IdPai] = item.IdPai || '';
        const [JustCancel] = item.JustCancel || '';
        const [FlagCancelado] = item.FlagCancelado || '';
        const [FlagTransferido] = item.FlagTransferido || '';
        const [DataTransferido] = item.DataTransferido || '';
        const [FlagProxDia] = item.FlagProxDia || '';
        const [DataProxDia] = item.DataProxDia || '';
        return {
          IdEvento,
          Data,
          HoraIni,
          HoraFim,
          Descricao,
          Titulo,
          Obs,
          Local,
          Publico,
          Solicitante,
          IdPai,
          JustCancel,
          FlagCancelado,
          FlagTransferido,
          DataTransferido,
          FlagProxDia,
          DataProxDia,
        };
      });

      let lote = [];
      for (const evento of eventos) {
        lote.push(evento);

        if (lote.length === 50) {
          // eslint-disable-next-line no-await-in-loop
          await knex.insert(lote).into(tableName);
          lote = [];
        }
      }

      // await knex.insert(eventos).into(tableName);

      res.json({ message: 'Dados importados com sucesso!' });
    } catch ({ message }) {
      res.status(500).json({ message });
    }
  }
}

export default new EventoController();
