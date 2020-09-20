import { Router } from 'express';
import AreaAtuacaoController from './app/controllers/AreaAtuacaoController';
import BaseEleitoralController from './app/controllers/BaseEleitoralController';
import PartidoCotroller from './app/controllers/PartidoCotroller';
import DeputadoController from './app/controllers/DeputadoController';
import DespesasController from './app/controllers/DespesaController';
import NaturezaController from './app/controllers/NaturezaController';
import ComissaoController from './app/controllers/ComissaoController';
import ComissaoMembroController from './app/controllers/ComissaoMembroController';
import DeliberacaoController from './app/controllers/DeliberacaoController';
import TipoParecerController from './app/controllers/TipoParecerController';
import ProposituraController from './app/controllers/ProposituraController';

const routes = new Router();

routes.post('/areas-atuacao', AreaAtuacaoController.import);

routes.post('/bases-eleitorais', BaseEleitoralController.import);

routes.post('/partidos', PartidoCotroller.import);

routes.post('/deputados', DeputadoController.import);
routes.post('/deputados/areas-atuacao', DeputadoController.importAreaAtuacao);
routes.post('/deputados/bases-eleitorais', DeputadoController.importBaseEleitoral);

routes.post('/despesas', DespesasController.import);

routes.post('/naturezas', NaturezaController.import);

routes.post('/comissoes', ComissaoController.import);

routes.post('/comissoes-membros', ComissaoMembroController.import);

routes.post('/deliberacoes', DeliberacaoController.import);

routes.post('/tipos-parecer', TipoParecerController.import);

routes.post('/proposituras', ProposituraController.import);

export default routes;
