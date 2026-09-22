// Preenche 'respostas' com um envio de TESTE completo e dispara enviarRespostas()
(function(){
  const R = respostas;
  Object.assign(R, {
    idade:'45–49', civil:'Casado(a)', juntos:'Sim', idadePar:'Não se aplica',
    sitEu:'Estou aposentado(a)', sitPar:'Não se aplica',
    cidade:'TESTE Brasília', uf:'DF', imovel:'Sim, onde moramos', filhos:'Não', netos:'Não',
    freq:'3–4', eAtiva:4, eAlim:5, eNat:4,
    naoPerder:'TESTE automatizado — pode apagar esta linha', facilitar:'',
    receber:'Tanto faz', espacosReceber:['Sala','Jardim'],
    impressao:5, identifica:4, consideraria:'Talvez',
    atrai:['Casa privativa com cozinha própria','Outro: teste de outro'],
    preocupa:'teste', desistir:'',
    tamanho:'101–120 m²', tamMin:'90', quartos:'3',
    lAdequada:5, lEscadas:3, lAdaptar:4,
    elevador:'Um sobrado com elevador', pagarMais:'Talvez',
    aCozinheiro:4, aAdaptar:5, preferiria:'Dependeria do dia',
    fEstrutura:4, fEducador:5, fComo:'Sozinho', fRegular:'Sim', fAtividades:['Caminhada','Yoga'],
    cConfort:4, cAfinidades:['Saúde','Natureza'], cSelecao:'Sim', cNivel:'Eventualmente',
    sSeguranca:5, sPessoas:5, sHabitos:4, sPercebido:'Muito',
    idealizador:'Positivo', regras:5,
    residenciaIdeal:'linha de TESTE', razaoQuerer:'', razaoNao:'', faltou:'',
    compraria:'Talvez', horizonte:'3–5 anos',
    justificaria:['Segurança e apoio comunitário','Relação custo × benefício favorável'],
    nome:'TESTE AUTOMATIZADO', fone:'(61) 90000-0000', email:'teste@teste.com'
  });
  R.aspectos = {}; R.espacos = {}; R.compartilhar = {};
  ['Conforto','Privacidade','Segurança','Saúde','Atividade física','Alimentação saudável','Convivência social','Contato com a natureza','Tranquilidade','Praticidade','Independência','Facilidade de manutenção','Receber amigos','Receber filhos e netos','Ter atividades de lazer','Ter serviços próximos','Ter apoio quando necessário','Envelhecer no mesmo imóvel'].forEach(r=>R.aspectos[r]=3);
  ['Suíte principal ampla','Suíte com banheiro para ele e para ela','Suíte com banheiro com duas cubas','Banheira','Segundo quarto','Terceiro quarto','Closet','Escritório','Sala de estar','Sala de TV','Cozinha ampla','Cozinha integrada','Despensa','Lavanderia','Lavabo','Varanda','Deck','Jardim privativo','Espaço gourmet','Churrasqueira','Garagem','Depósito','Espaço para bicicletas/equipamentos esportivos'].forEach(r=>R.espacos[r]=4);
  ['Academia','Área de treinamento funcional','Pequena piscina','Sauna','Jardins','Área gourmet','Refeições','Equipamentos esportivos','Espaços de convivência','Serviços de manutenção'].forEach(r=>R.compartilhar[r]='Eventualmente');
  window.__testeResultado = 'pendente';
  enviarRespostas().then(r=>{window.__testeResultado='enviado type='+ (r&&r.type);}).catch(e=>{window.__testeResultado='ERRO '+e;});
})();
