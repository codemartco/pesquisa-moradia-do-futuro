/**
 * AJUSTES v3 — alterações do DOCX "alteracoes-moradia-do-futuro" (2026-09-22)
 * aplicadas ao formulário EXISTENTE (mesmo link).
 *
 *  1. Idade: + opção "Outra idade"
 *  2. "Moram juntos?": + "Não se aplica" (sincronia com o form custom)
 *  3. Situação atual (eu e parceiro): excluir "Um trabalha e outro não"
 *  4. Excluir "Quais atividades pratica?"
 *  5. Escala alimentação → "Manter uma alimentação saudável frequentemente"
 *  6. Excluir "Quanto você valoriza ter tempo para lazer..."
 *  7. Texto do conceito: 3 edições (refeições/receber; cozinheiro/educador; Blue Zones)
 *  8. Elevador → "O que você preferiria entre estas opções abaixo?" (térrea × sobrado + Outro)
 *  9. Excluir "...liberdade para escolher quando participar..."
 * 10. Excluir "Quanto você valoriza uma alimentação planejada..."
 * 11. Excluir "Quais refeições teriam maior valor para você?"
 * 12. Residência ideal → "...o que MAIS ela teria?"
 */

function ajustarFormularioV3() {
  var form = FormApp.openById('1WlOJmismt46sEDLXVadPsWWeNCKR-zXbBoWmtEQEV1Q');
  var log = [];

  var EXCLUIR = [
    'Quais atividades pratica?',
    'Quanto você valoriza ter tempo para lazer, viagens e atividades pessoais?',
    'Quanto é importante para você ter liberdade para escolher quando participar das atividades e momentos coletivos?',
    'Quanto você valoriza uma alimentação planejada não apenas para ser saudável, mas para contribuir para uma longevidade com qualidade de vida, preservação da força, mobilidade, disposição e autonomia?',
    'Quais refeições teriam maior valor para você?'
  ];

  // exclusões (de trás pra frente para não bagunçar índices)
  var items = form.getItems();
  for (var i = items.length - 1; i >= 0; i--) {
    if (EXCLUIR.indexOf(items[i].getTitle()) >= 0) {
      log.push('EXCLUIDA: ' + items[i].getTitle().slice(0, 50));
      form.deleteItem(i);
    }
  }

  form.getItems().forEach(function (it) {
    var t = it.getTitle();

    if (t === 'Qual sua idade?') {
      var mc = it.asMultipleChoiceItem();
      mc.setChoices(['45-49', '50-54', '55-59', '60-65', 'Outra idade']
        .map(function (o) { return mc.createChoice(o); }));
      log.push('1. idade + "Outra idade"');
    }

    if (t === 'Moram juntos?') {
      var mj = it.asMultipleChoiceItem();
      mj.setChoices(['Sim', 'Não', 'Não se aplica']
        .map(function (o) { return mj.createChoice(o); }));
      log.push('2. juntos + "Não se aplica"');
    }

    if (t === 'Qual é a sua situação atual?') {
      var s1 = it.asMultipleChoiceItem();
      s1.setChoices(['Ainda tenho trabalho integral', 'Trabalho em tempo parcial',
        'Posso trabalhar remotamente', 'Estou aposentado(a)',
        'Meu trabalho não exige minha presença regular']
        .map(function (o) { return s1.createChoice(o); }));
      s1.showOtherOption(true);
      log.push('3a. situação (eu) sem "Um trabalha..."');
    }

    if (t === 'Qual é a situação atual de seu parceiro(a)?') {
      var s2 = it.asMultipleChoiceItem();
      s2.setChoices(['Ainda tem trabalho integral', 'Trabalha em tempo parcial',
        'Pode trabalhar remotamente', 'Está aposentado(a)',
        'O trabalho dele(a) não exige presença regular', 'Não se aplica']
        .map(function (o) { return s2.createChoice(o); }));
      s2.showOtherOption(true);
      log.push('3b. situação (parceiro) sem "Um trabalha..."');
    }

    if (t === 'Qual a importância de uma alimentação saudável para sua qualidade de vida?') {
      it.setTitle('Manter uma alimentação saudável frequentemente');
      log.push('5. escala alimentação renomeada');
    }

    if (it.getType() === FormApp.ItemType.PAGE_BREAK &&
        t === 'O conceito de moradia desta pesquisa') {
      var pb = it.asPageBreakItem();
      var txt = pb.getHelpText();
      txt = txt.replace('incluindo cozinha privativa para preparar suas próprias refeições e receber familiares e amigos.',
                        'incluindo cozinha privativa para preparar suas próprias refeições.');
      txt = txt.replace(/Durante cinco dias por semana[\s\S]*?com privacidade\./,
        'Ter um cozinheiro 05 dias na semana para preparar refeições nutricionalmente planejadas, para serem compartilhadas na área gourmet ou para levar pra casa, como preferir.');
      txt = txt.replace(/Durante seis dias por semana[\s\S]*?necessidades\./,
        'Ter um educador físico acompanhando os treinos matutinos em pequenos grupos ou individualmente, por 06 dias por semana.');
      txt = txt.replace(/Mais do que simplesmente comprar uma casa[\s\S]*?qualidade!/,
        'Mais do que comprar uma casa com privacidade, autonomia, segurança, saúde, boa alimentação, atividade física, natureza e convivência, esse projeto visa proporcionar uma vida longeva com qualidade, através das referências das Blue Zones.');
      pb.setHelpText(txt);
      log.push('7. texto do conceito atualizado');
    }

    if (t === 'Se pudesse criar a residência ideal para os próximos 20 anos da sua vida, o que ela teria?') {
      it.setTitle('Se pudesse criar a residência ideal para os próximos 20 anos da sua vida, o que MAIS ela teria?');
      log.push('12. residência ideal "MAIS"');
    }
  });

  // 8. elevador → nova pergunta de preferência, na mesma posição
  var its = form.getItems();
  for (var j = 0; j < its.length; j++) {
    if (its[j].getTitle() === 'Como você avalia a importância de um elevador residencial em uma casa de dois pavimentos?') {
      form.deleteItem(j);
      var novo = form.addMultipleChoiceItem()
        .setTitle('O que você preferiria entre estas opções abaixo?')
        .setRequired(true);
      novo.setChoices(['Uma casa térrea menor sem vista', 'Um sobrado com elevador']
        .map(function (o) { return novo.createChoice(o); }));
      novo.showOtherOption(true);
      form.moveItem(form.getItems().length - 1, j);
      log.push('8. elevador → térrea × sobrado');
      break;
    }
  }

  Logger.log('V3 APLICADO:\n' + log.join('\n'));
  Logger.log('Total de itens: ' + form.getItems().length);
}
