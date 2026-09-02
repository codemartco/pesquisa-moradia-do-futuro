/**
 * AJUSTES v2.1 — correções do cliente (2026-08-30, WhatsApp) aplicadas ao
 * formulário EXISTENTE (mesmo link), sem recriar.
 *
 * 1. "Qual é a sua situação atual?" — 1ª pessoa: "Posso trabalhar remotamente"
 * 2. "Qual é a situação atual de seu parceiro(a)?" — respostas na 3ª pessoa,
 *    incl. "Pode trabalhar remotamente"
 * 3. Texto do conceito: "formada por moradores de apenas quatro casais" →
 *    "formada por apenas quatro casais"
 * 4. "Quais refeições teriam maior valor para você?" → múltipla escolha
 *    (checkbox; "Todas" removida por ficar redundante)
 * 5. "...que os quatro proprietários participassem..." →
 *    "...que todos os moradores participassem..."
 */

var FORM_ID_V2 = '1WlOJmismt46sEDLXVadPsWWeNCKR-zXbBoWmtEQEV1Q';

function ajustarFormularioV2_1() {
  var form = FormApp.openById(FORM_ID_V2);
  var log = [];

  form.getItems().forEach(function (it) {
    var t = it.getTitle();

    if (t === 'Qual é a sua situação atual?') {
      var mc = it.asMultipleChoiceItem();
      mc.setChoices([
        'Ainda tenho trabalho integral',
        'Trabalho em tempo parcial',
        'Posso trabalhar remotamente',
        'Um trabalha e outro não',
        'Estou aposentado(a)',
        'Meu trabalho não exige minha presença regular'
      ].map(function (o) { return mc.createChoice(o); }));
      mc.showOtherOption(true);
      log.push('1. situação atual (1ª pessoa) OK');
    }

    if (t === 'Qual é a situação atual de seu parceiro(a)?') {
      var mc2 = it.asMultipleChoiceItem();
      mc2.setChoices([
        'Ainda tem trabalho integral',
        'Trabalha em tempo parcial',
        'Pode trabalhar remotamente',
        'Um trabalha e outro não',
        'Está aposentado(a)',
        'O trabalho dele(a) não exige presença regular',
        'Não se aplica'
      ].map(function (o) { return mc2.createChoice(o); }));
      mc2.showOtherOption(true);
      log.push('2. situação parceiro(a) (3ª pessoa) OK');
    }

    if (it.getType() === FormApp.ItemType.PAGE_BREAK &&
        t === 'O conceito de moradia desta pesquisa') {
      var pb = it.asPageBreakItem();
      var txt = pb.getHelpText();
      if (txt.indexOf('formada por moradores de apenas quatro casais') >= 0) {
        pb.setHelpText(txt.replace('formada por moradores de apenas quatro casais',
                                   'formada por apenas quatro casais'));
        log.push('3. conceito sem "moradores de" OK');
      }
    }

    if (t === 'Você consideraria positivo que os quatro proprietários participassem da definição das regras de convivência e dos serviços compartilhados?') {
      it.setTitle('Você consideraria positivo que todos os moradores participassem da definição das regras de convivência e dos serviços compartilhados?');
      log.push('5. "todos os moradores" OK');
    }
  });

  // 4. Refeições: escolha única -> múltipla escolha, na mesma posição
  var items = form.getItems();
  for (var i = 0; i < items.length; i++) {
    if (items[i].getTitle() === 'Quais refeições teriam maior valor para você?' &&
        items[i].getType() === FormApp.ItemType.MULTIPLE_CHOICE) {
      form.deleteItem(i);
      var cb = form.addCheckboxItem()
        .setTitle('Quais refeições teriam maior valor para você?')
        .setRequired(true);
      cb.setChoices(['Café da manhã', 'Almoço', 'Jantar', 'Refeições especiais']
        .map(function (o) { return cb.createChoice(o); }));
      form.moveItem(form.getItems().length - 1, i);
      log.push('4. refeições em múltipla escolha OK');
      break;
    }
  }

  Logger.log('AJUSTES APLICADOS:\n' + log.join('\n'));
  Logger.log('Total de itens: ' + form.getItems().length);
}
