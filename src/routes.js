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
import ReuniaoCotnroller from './app/controllers/ReuniaoController';
import VotacaoController from './app/controllers/VotacaoController';
import AutorController from './app/controllers/AutorController';
import PalavraChaveController from './app/controllers/PalavraChaveController';
import PresencaController from './app/controllers/PresencaController';
import RegimeTramitacaoController from './app/controllers/RegimeTramitacaoController';
import TramitacaoController from './app/controllers/TramitacaoController';
import UnidadeAdministrativaController from './app/controllers/UnidadeAdministrativaController';
import CargoController from './app/controllers/CargoController';
import LotacaoController from './app/controllers/LotacaoController';
import LotacaoFuncionarioController from './app/controllers/LotacaoFuncionarioController';
import TemaController from './app/controllers/TemaController';
import SubTemaController from './app/controllers/SubTemaController';
import TipoNormasController from './app/controllers/TipoNormaController';
import NormaController from './app/controllers/NormaController';
import NormaAnotacaoController from './app/controllers/NormaAnotacaoController';
import EventoController from './app/controllers/EventoController';

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
routes.post('/tipos-parecer/proposituras', TipoParecerController.importPropositura);

routes.post('/proposituras', ProposituraController.import);

routes.post('/reunioes', ReuniaoCotnroller.import);

routes.post('/votacoes', VotacaoController.import);

routes.post('/autores', AutorController.import);

routes.post('/palavras-chave', PalavraChaveController.import);
routes.post('/palavras-chave/documentos', PalavraChaveController.importDocumentos);

routes.post('/presencas', PresencaController.import);

routes.post('/regimes-tramitacao', RegimeTramitacaoController.import);

routes.post('/tramitacoes', TramitacaoController.import);

routes.post('/unidades-administrativas', UnidadeAdministrativaController.import);

routes.post('/cargos', CargoController.import);

routes.post('/lotacoes', LotacaoController.import);

routes.post('/lotacoes-funcionarios', LotacaoFuncionarioController.import);

routes.post('/temas', TemaController.import);

routes.post('/sub-temas', SubTemaController.import);

routes.post('/tipo-normas', TipoNormasController.import);

routes.post('/normas', NormaController.import);

routes.post('/normas-anotacoes', NormaAnotacaoController.import);

routes.post('/eventos', EventoController.import);

export default routes;
