/**
 * PESQUISA SOBRE UM NOVO CONCEITO DE MORADIA PARA A LONGEVIDADE COM QUALIDADE
 * Versão definitiva — baseada no questionário do cliente (v2, 2026-08-30).
 *
 * Sem referência à localização do empreendimento (removido "Pirenópolis").
 * "Onde você mora atualmente?" é campo aberto (Cidade e Estado).
 * Termina com campos OPCIONAIS de contato: Nome, Telefone com DDD, E-mail.
 *
 * Como usar:
 *  1. Cole este arquivo inteiro no editor do Apps Script (substituindo tudo).
 *  2. Execute criarPesquisaPirenopolis().
 *  3. Copie do Registro de execução os links de edição, resposta e planilha.
 *
 * ATENÇÃO: cada execução cria um formulário NOVO (link novo).
 */

var CONFIG = {
  TITULO: 'Pesquisa sobre um novo conceito de moradia para a longevidade com qualidade',
  CRIAR_PLANILHA: true,
  COLETAR_EMAIL: false,
  MOSTRAR_BARRA_PROGRESSO: true
};

// ---------------------------------------------------------------------------
// TEXTOS PADRONIZADOS
// ---------------------------------------------------------------------------

var TEXTO_ABERTURA =
  'Olá! Esta pesquisa faz parte do estudo de um novo conceito de moradia voltado à ' +
  'longevidade com qualidade de vida. Ela leva cerca de 10 a 12 minutos.\n\n' +
  'Não há respostas certas ou erradas — queremos entender o que faz sentido para você. ' +
  'As respostas são confidenciais e serão analisadas apenas de forma agregada.\n\n' +
  'Ao continuar, você concorda em participar voluntariamente desta pesquisa.';

var TEXTO_CONCEITO =
  'UMA NOVA FORMA DE VIVER\n\n' +
  'Imagine morar em uma residência confortável e privativa, mas fazendo parte de uma ' +
  'pequena comunidade formada por apenas quatro casais (ou indivíduos) de ' +
  'faixa etária aproximada, com afinidades de interesses e estilo de vida.\n\n' +
  'Cada casal terá sua própria casa, com todos os espaços necessários para viver com ' +
  'independência, privacidade e conforto, incluindo cozinha privativa para preparar suas ' +
  'próprias refeições e receber familiares e amigos.\n\n' +
  'Ao mesmo tempo, o condomínio contará com áreas comuns cuidadosamente planejadas para ' +
  'favorecer a convivência social, o bem-estar e a manutenção de um estilo de vida ativo ' +
  'e saudável.\n\n' +
  'Durante cinco dias por semana, um cozinheiro contratado poderá preparar refeições ' +
  'elaboradas e nutricionalmente planejadas para os moradores. As refeições poderão ser ' +
  'compartilhadas em uma agradável área gourmet, proporcionando momentos de convivência, ' +
  'ou cada morador poderá optar por fazer sua refeição em sua própria casa, com privacidade.\n\n' +
  'Durante seis dias por semana, haverá um educador físico compartilhado para ' +
  'acompanhamento dos treinos matinais. Os moradores poderão participar de atividades ' +
  'orientadas em pequenos grupos ou utilizar a estrutura individualmente, de acordo com ' +
  'seus interesses, tempo e necessidades.\n\n' +
  'A proposta também contempla um ambiente seguro e privado, com áreas verdes, espaços de ' +
  'convivência e lazer, criando condições para que os moradores mantenham hábitos ' +
  'saudáveis, convivam com pessoas com interesses semelhantes e tenham apoio próximo ' +
  'quando necessário.\n\n' +
  'O projeto utiliza princípios de bioarquitetura, buscando soluções construtivas que ' +
  'valorizem a relação entre a edificação, o ambiente e o conforto dos moradores.\n\n' +
  'O paisagismo utiliza conceitos de biofilia, valorizando a presença da natureza e, ' +
  'especialmente, da vegetação característica do Cerrado, criando uma relação mais ' +
  'próxima entre os moradores e o ambiente natural.\n\n' +
  'Mais do que simplesmente comprar uma casa, a proposta é criar uma forma de viver que ' +
  'combine privacidade, autonomia, segurança, saúde, boa alimentação, atividade física, ' +
  'natureza e convivência social. Essa ambiência é a principal característica natural das ' +
  'Blue Zones para uma vida longeva com qualidade!\n\n' +
  'O empreendimento será concebido para que seus moradores possam desfrutar dessa forma ' +
  'de viver não apenas hoje, mas também ao longo dos próximos 15 a 30 anos, com conforto ' +
  'e possibilidade de adaptação às mudanças naturais da vida.';

var TEXTO_CONTATO =
  'Se quiser ser avisado(a) sobre o andamento do projeto ou participar de uma conversa ' +
  'em grupo, deixe seu nome com (DDD) e telefone ou e-mail. Estes campos são opcionais.';

var FAIXAS_IDADE = ['45-49', '50-54', '55-59', '60-65'];

var SITUACAO_ATUAL = [
  'Ainda tenho trabalho integral',
  'Trabalho em tempo parcial',
  'Posso trabalhar remotamente',
  'Um trabalha e outro não',
  'Estou aposentado(a)',
  'Meu trabalho não exige minha presença regular'
];

var SITUACAO_PARCEIRO = [
  'Ainda tem trabalho integral',
  'Trabalha em tempo parcial',
  'Pode trabalhar remotamente',
  'Um trabalha e outro não',
  'Está aposentado(a)',
  'O trabalho dele(a) não exige presença regular'
];

// ---------------------------------------------------------------------------
// FUNÇÃO PRINCIPAL
// ---------------------------------------------------------------------------

function criarPesquisaPirenopolis() {
  var form = FormApp.create(CONFIG.TITULO);
  form.setDescription(TEXTO_ABERTURA)
      .setCollectEmail(CONFIG.COLETAR_EMAIL)
      .setProgressBar(CONFIG.MOSTRAR_BARRA_PROGRESSO)
      .setAllowResponseEdits(false)
      .setShowLinkToRespondAgain(false)
      .setConfirmationMessage('Obrigado por participar! Sua opinião vai ajudar a definir como esse conceito de moradia será desenvolvido.');

  var h = helpers_(form);

  // ---- BLOCO 1 — PERFIL DO CASAL ---------------------------------------
  h.secao('Bloco 1 — Perfil do casal', '');

  h.unica('Qual sua idade?', FAIXAS_IDADE, true);

  h.unica('Qual seu estado civil?',
    ['Casado(a)', 'Solteiro(a)', 'Viúvo(a)', 'Namorando'], true);

  h.unica('Moram juntos?', ['Sim', 'Não'], false);

  h.unica('Qual a idade do seu parceiro(a)?',
    FAIXAS_IDADE.concat(['Não se aplica']), false);

  h.unica('Qual é a sua situação atual?', SITUACAO_ATUAL, true, true);

  h.unica('Qual é a situação atual de seu parceiro(a)?',
    SITUACAO_PARCEIRO.concat(['Não se aplica']), false, true);

  h.texto('Onde você mora atualmente? (Cidade e Estado)', true);

  h.unica('Você possui imóvel próprio?',
    ['Sim, onde moramos', 'Sim, mas não é minha residência', 'Não'], true);

  h.unica('Você tem filhos?',
    ['Sim, morando junto', 'Sim, morando próximos', 'Sim, morando em outra cidade', 'Sim, com pouco contato', 'Não'], true);

  h.unica('Vocês têm netos?', ['Sim', 'Não'], true);

  // ---- BLOCO 2 — ESTILO DE VIDA ATUAL ----------------------------------
  h.secao('Bloco 2 — Estilo de vida atual', '');

  h.unica('Quantos dias por semana você pratica atividade física?',
    ['Nenhum', '1-2', '3-4', '5-6', 'Todos os dias'], true);

  h.multipla('Quais atividades pratica?',
    ['Musculação', 'Caminhada', 'Corrida', 'Ciclismo', 'Natação', 'Pilates', 'Yoga', 'Funcional', 'Tênis/padel', 'Esportes coletivos', 'Trilhas'],
    false, true);

  h.escala('Qual a importância de manter uma vida fisicamente ativa nos próximos 10-20 anos?',
    'Nada importante', 'Extremamente importante', true);

  h.escala('Qual a importância de uma alimentação saudável para sua qualidade de vida?',
    'Nada importante', 'Extremamente importante', true);

  h.escala('Quanto você valoriza viver próximo à natureza?',
    'Nada', 'Muito', true);

  h.escala('Quanto você valoriza ter tempo para lazer, viagens e atividades pessoais?',
    'Nada', 'Muito', true);

  // ---- BLOCO 3 — A VIDA QUE VOCÊ DESEJA TER OU MANTER ------------------
  h.secao('Bloco 3 — A vida que você deseja ter ou manter', '');

  h.grade('Pensando nos próximos 10-20 anos, quais aspectos você gostaria que sua moradia proporcionasse?',
    ['Conforto', 'Privacidade', 'Segurança', 'Saúde', 'Atividade física', 'Alimentação saudável', 'Convivência social', 'Contato com a natureza', 'Tranquilidade', 'Praticidade', 'Independência', 'Facilidade de manutenção', 'Receber amigos', 'Receber filhos e netos', 'Ter atividades de lazer', 'Ter serviços próximos', 'Ter apoio quando necessário', 'Envelhecer no mesmo imóvel'],
    ['1 - Pouco importante', '2', '3', '4', '5 - Muito importante'], true);

  h.aberta('O que você não gostaria de perder no seu estilo de vida à medida que envelhece?', false);

  h.aberta('O que você gostaria que sua próxima moradia facilitasse na sua vida?', false);

  h.unica('Você gosta de receber amigos em casa ou prefere encontrá-los em outros espaços?',
    ['Gosto muito de receber em casa', 'Gosto de receber, mas ocasionalmente', 'Tanto faz', 'Prefiro encontrar amigos fora de casa', 'Prefiro não receber'], true);

  h.multipla('Quando recebe amigos ou familiares, quais espaços considera mais importantes?',
    ['Sala', 'Cozinha', 'Varanda', 'Deck', 'Espaço gourmet', 'Jardim', 'Piscina', 'Churrasqueira'],
    true, true);

  // ---- APRESENTAÇÃO DO CONCEITO + BLOCO 4 ------------------------------
  h.secao('O conceito de moradia desta pesquisa', TEXTO_CONCEITO);

  h.escala('Qual sua impressão geral sobre essa proposta?',
    'Muito negativa', 'Muito positiva', true);

  h.escala('Quanto você se identifica com esse estilo de vida?',
    'Nada', 'Totalmente', true);

  h.unica('Você consideraria morar em um empreendimento como esse?',
    ['Certamente', 'Provavelmente', 'Talvez', 'Provavelmente não', 'Certamente não'], true);

  h.multipla('O que mais atrai você nessa proposta?',
    ['Casa privativa com cozinha própria', 'Comunidade pequena, de apenas quatro casas, com afinidades', 'Cozinheiro compartilhado cinco dias por semana', 'Educador físico compartilhado seis dias por semana', 'Segurança de um complexo residencial privado', 'Contato com a natureza e vegetação do Cerrado', 'Bioarquitetura e sustentabilidade', 'Apoio próximo quando necessário', 'Casa preparada para os próximos 15-30 anos', 'Convivência social sem perder privacidade'],
    true, true);

  h.aberta('O que mais lhe preocupa?', false);

  h.aberta('O que poderia fazer você desistir de morar em uma comunidade como essa?', false);

  // ---- BLOCO 5 — A CASA IDEAL NESTA PROPOSTA ---------------------------
  h.secao('Bloco 5 — A casa ideal nesta proposta', '');

  h.unica('Pensando no atual momento de vida e nos próximos 10-20 anos, qual seria o tamanho ideal de uma residência para vocês?',
    ['Até 80 m²', '81-100 m²', '101-120 m²', '121-150 m²', 'Mais de 150 m²', 'Não sei'], true);

  h.texto('E qual seria o tamanho mínimo que consideraria confortável?', false);

  h.unica('Quantos quartos vocês considerariam ideais?',
    ['1', '2', '3', '4 ou mais'], true);

  h.grade('Qual importância você atribui a cada espaço?',
    ['Suíte principal ampla', 'Suíte com banheiro para ele e para ela', 'Suíte com banheiro com duas cubas', 'Banheira', 'Segundo quarto', 'Terceiro quarto', 'Closet', 'Escritório', 'Sala de estar', 'Sala de TV', 'Cozinha ampla', 'Cozinha integrada', 'Despensa', 'Lavanderia', 'Lavabo', 'Varanda', 'Deck', 'Jardim privativo', 'Espaço gourmet', 'Churrasqueira', 'Garagem', 'Depósito', 'Espaço para bicicletas/equipamentos esportivos'],
    ['1 - Pouco importante', '2', '3', '4', '5 - Muito importante'], true);

  // ---- BLOCO 6 — LONGEVIDADE DA CASA -----------------------------------
  h.secao('Bloco 6 — Longevidade da casa', '');

  h.escala('Quão importante é para você que a casa possa continuar adequada às suas necessidades pelos próximos 15-30 anos?',
    'Nada importante', 'Extremamente importante', true);

  h.escala('Você gostaria de poder utilizar os principais ambientes da casa sem depender rotineiramente de escadas?',
    'Indiferente', 'Muito importante', true);

  h.escala('Você considera importante que a casa possa receber adaptações futuras caso sua mobilidade ou necessidades mudem?',
    'Nada importante', 'Extremamente importante', true);

  h.unica('Como você avalia a importância de um elevador residencial em uma casa de dois pavimentos?',
    ['Essencial', 'Muito importante', 'Importante', 'Pouco importante, mas interessante', 'Nada importante', 'Não quero'], true);

  h.unica('Você estaria disposto a pagar mais por uma residência preparada para proporcionar maior autonomia e conforto ao longo do envelhecimento?',
    ['Não', 'Talvez', 'Sim, dependendo do valor', 'Sim'], true);

  // ---- BLOCO 7 — COMPARTILHAMENTO --------------------------------------
  h.secao('Bloco 7 — Compartilhamento', '');

  h.grade('Como você se sentiria em compartilhar os seguintes elementos?',
    ['Academia', 'Área de treinamento funcional', 'Pequena piscina', 'Sauna', 'Jardins', 'Área gourmet', 'Refeições', 'Equipamentos esportivos', 'Espaços de convivência', 'Serviços de manutenção'],
    ['Compartilharia tranquilamente', 'Compartilharia eventualmente', 'Preferiria privativo', 'Não gostaria de compartilhar'], true);

  h.escala('Quanto é importante para você ter liberdade para escolher quando participar das atividades e momentos coletivos?',
    'Nada importante', 'Extremamente importante', true);

  // ---- BLOCO 8 — ALIMENTAÇÃO E LONGEVIDADE -----------------------------
  h.secao('Bloco 8 — Alimentação e longevidade', '');

  h.escala('Quanto você valoriza uma alimentação planejada não apenas para ser saudável, mas para contribuir para uma longevidade com qualidade de vida, preservação da força, mobilidade, disposição e autonomia?',
    'Nada', 'Muito', true);

  h.escala('Qual seu interesse em contar com um cozinheiro compartilhado cinco dias por semana?',
    'Nenhum interesse', 'Muito interesse', true);

  h.multipla('Quais refeições teriam maior valor para você?',
    ['Café da manhã', 'Almoço', 'Jantar', 'Refeições especiais'], true);

  h.unica('Você preferiria:',
    ['Preparar todas as refeições em casa', 'Alternar entre casa e área gourmet', 'Fazer a maioria das refeições coletivamente', 'Dependeria do dia'], true);

  h.escala('Quanto valoriza poder adaptar as refeições às suas necessidades e preferências individuais?',
    'Nada', 'Muito', true);

  // ---- BLOCO 9 — ATIVIDADE FÍSICA --------------------------------------
  h.secao('Bloco 9 — Atividade física', '');

  h.escala('Qual a importância de ter uma estrutura de exercícios dentro do condomínio?',
    'Nada importante', 'Extremamente importante', true);

  h.escala('Qual a importância de contar com um educador físico compartilhado seis dias por semana?',
    'Nada importante', 'Extremamente importante', true);

  h.unica('Você preferiria:',
    ['Treinar sozinho', 'Treinar com seu parceiro', 'Treinar em pequenos grupos', 'Alternar entre as opções'], true);

  h.unica('Você acredita que ter um profissional disponível no próprio condomínio aumentaria sua regularidade nos exercícios?',
    ['Sim', 'Provavelmente', 'Talvez', 'Não'], true);

  h.multipla('Quais atividades mais lhe interessariam?',
    ['Musculação', 'Treinamento funcional', 'Mobilidade', 'Alongamento', 'Yoga', 'Pilates', 'Caminhada', 'Corrida', 'Ciclismo'],
    true, true);

  // ---- BLOCO 10 — COMUNIDADE INTENCIONAL -------------------------------
  h.secao('Bloco 10 — Comunidade intencional', '');

  h.escala('Você se sentiria confortável em morar em uma comunidade formada intencionalmente por pessoas com afinidades de estilo de vida e interesses?',
    'Nada confortável', 'Muito confortável', true);

  h.multipla('Quais afinidades seriam mais importantes para você?',
    ['Saúde', 'Esporte', 'Alimentação', 'Natureza', 'Viagens', 'Gastronomia', 'Cultura', 'Música', 'Tranquilidade', 'Vida social', 'Família'],
    true, true);

  h.unica('Você gostaria que os futuros moradores participassem de algum processo de compatibilidade/seleção antes da aquisição das casas?',
    ['Sim', 'Talvez', 'Não'], true);

  h.unica('Qual nível de convivência você gostaria de ter com os outros moradores?',
    ['Diariamente', 'Algumas vezes por semana', 'Uma vez por semana', 'Algumas vezes por mês', 'Eventualmente', 'Prefiro pouca convivência'], true);

  // ---- BLOCO 11 — SEGURANÇA, APOIO E ESTILO DE VIDA --------------------
  h.secao('Bloco 11 — Segurança, apoio e estilo de vida', '');

  h.escala('Quanto valor você atribui à sensação de segurança proporcionada por viver em um complexo residencial privado?',
    'Nenhum valor', 'Muito valor', true);

  h.escala('Quanto valor você atribui à possibilidade de ter pessoas próximas com quem possa contar em uma eventual necessidade?',
    'Nenhum valor', 'Muito valor', true);

  h.escala('Quanto valor você atribui à possibilidade de viver em um ambiente que estimule e facilite a manutenção de hábitos saudáveis?',
    'Nenhum valor', 'Muito valor', true);

  h.unica('Considerando segurança, apoio próximo e um ambiente que favoreça hábitos saudáveis, quanto esses fatores aumentariam o valor percebido dessa moradia para você?',
    ['Nada', 'Pouco', 'Moderadamente', 'Muito', 'Extremamente'], true);

  // ---- BLOCO 12 — O IDEALIZADOR COMO MORADOR E REGRAS ------------------
  h.secao('Bloco 12 — O idealizador como morador e regras de convivência', '');

  h.unica('Como você se sentiria sabendo que o próprio idealizador/desenvolvedor do empreendimento também será morador de uma das quatro casas?',
    ['Muito positivo', 'Positivo', 'Indiferente', 'Negativo', 'Muito negativo'], true);

  h.escala('Você consideraria positivo que todos os moradores participassem da definição das regras de convivência e dos serviços compartilhados?',
    'Nada positivo', 'Muito positivo', true);

  // ---- BLOCO 13 — O QUE REALMENTE VOCÊ GOSTARIA OU NÃO -----------------
  h.secao('Bloco 13 — O que realmente você gostaria ou não', '');

  h.aberta('Se pudesse criar a residência ideal para os próximos 20 anos da sua vida, o que ela teria?', false);

  h.aberta('Qual seria a principal razão para você querer morar em um empreendimento assim?', false);

  h.aberta('Qual seria a principal razão para você não querer morar nele?', false);

  h.aberta('Existe alguma coisa importante para você em uma moradia desse tipo que não perguntamos?', false);

  // ---- BLOCO 14 — VOCÊ COMPRARIA ---------------------------------------
  h.secao('Bloco 14 — Você compraria', '');

  h.unica('Você consideraria comprar sua residência em um empreendimento como esse?',
    ['Certamente compraria', 'Provavelmente compraria', 'Talvez', 'Provavelmente não', 'Certamente não'], true);

  h.unica('Em que horizonte você teria maior probabilidade de realizar essa compra?',
    ['Agora', '1-2 anos', '3-5 anos', '5-10 anos', 'Sem previsão'], true);

  h.multiplaMax('Considerando tudo o que foi apresentado, quais são os três principais elementos que mais justificariam a compra? (marque até 3)',
    ['Ter uma casa privativa adequada e com as possibilidades de adaptações para os próximos 15 a 30 anos', 'Uma comunidade de vizinhos com afinidades de interesses, estilo de vida e propósito', 'Serviços para manutenção da saúde, bem-estar e qualidade de vida', 'Segurança e apoio comunitário', 'Arquitetura natural e ambiente com sustentabilidade', 'Conveniência proporcionada pelos serviços e manutenção do complexo e casas', 'Possível relação custo x benefício favorável'],
    3, true);

  // ---- CONTATO (OPCIONAL) ----------------------------------------------
  h.secao('Para continuar próximo do projeto', TEXTO_CONTATO);

  h.texto('Nome', false);
  h.texto('Telefone com DDD', false);
  h.email('E-mail', false);

  // ---- Planilha de respostas -------------------------------------------
  var urlPlanilha = '';
  if (CONFIG.CRIAR_PLANILHA) {
    var ss = SpreadsheetApp.create(CONFIG.TITULO + ' — respostas');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    urlPlanilha = ss.getUrl();
  }

  Logger.log('==========================================================');
  Logger.log('FORMULÁRIO CRIADO');
  Logger.log('Link de EDIÇÃO:    ' + form.getEditUrl());
  Logger.log('Link p/ RESPONDER: ' + form.getPublishedUrl());
  if (urlPlanilha) Logger.log('Planilha:          ' + urlPlanilha);
  Logger.log('Total de itens:    ' + form.getItems().length);
  Logger.log('==========================================================');
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

function helpers_(form) {
  return {
    // Nova seção (quebra de página) com título e texto de apoio
    secao: function (titulo, descricao) {
      var pb = form.addPageBreakItem().setTitle(titulo);
      if (descricao) pb.setHelpText(descricao);
      return pb;
    },

    // Escolha única (radio). outra=true adiciona a opção "Outro..."
    unica: function (titulo, opcoes, obrigatoria, outra) {
      var item = form.addMultipleChoiceItem().setTitle(titulo).setRequired(!!obrigatoria);
      item.setChoices(opcoes.map(function (o) { return item.createChoice(o); }));
      if (outra) item.showOtherOption(true);
      return item;
    },

    // Múltipla escolha (checkbox). outra=true adiciona a opção "Outro..."
    multipla: function (titulo, opcoes, obrigatoria, outra) {
      var item = form.addCheckboxItem().setTitle(titulo).setRequired(!!obrigatoria);
      item.setChoices(opcoes.map(function (o) { return item.createChoice(o); }));
      if (outra) item.showOtherOption(true);
      return item;
    },

    // Múltipla escolha limitada a no máximo N marcações
    multiplaMax: function (titulo, opcoes, max, obrigatoria) {
      var item = form.addCheckboxItem().setTitle(titulo).setRequired(!!obrigatoria);
      item.setChoices(opcoes.map(function (o) { return item.createChoice(o); }));
      item.setValidation(FormApp.createCheckboxValidation()
        .requireSelectAtMost(max).build());
      return item;
    },

    // Escala linear 1 a 5
    escala: function (titulo, rotuloMin, rotuloMax, obrigatoria) {
      return form.addScaleItem().setTitle(titulo)
        .setBounds(1, 5).setLabels(rotuloMin, rotuloMax)
        .setRequired(!!obrigatoria);
    },

    // Matriz (grade de escolha única por linha)
    grade: function (titulo, linhas, colunas, obrigatoria) {
      return form.addGridItem().setTitle(titulo)
        .setRows(linhas).setColumns(colunas)
        .setRequired(!!obrigatoria);
    },

    // Pergunta aberta longa (parágrafo)
    aberta: function (titulo, obrigatoria) {
      return form.addParagraphTextItem().setTitle(titulo).setRequired(!!obrigatoria);
    },

    // Resposta curta (uma linha)
    texto: function (titulo, obrigatoria) {
      return form.addTextItem().setTitle(titulo).setRequired(!!obrigatoria);
    },

    // Resposta curta com validação de e-mail
    email: function (titulo, obrigatoria) {
      var item = form.addTextItem().setTitle(titulo).setRequired(!!obrigatoria);
      item.setValidation(FormApp.createTextValidation()
        .setHelpText('Digite um e-mail válido')
        .requireTextIsEmail().build());
      return item;
    }
  };
}
