# Pesquisa — Moradia do Futuro

Pesquisa de mercado para um novo conceito de moradia voltado à longevidade com qualidade:
condomínio de **apenas quatro casas** para casais/indivíduos com afinidades, cozinheiro
compartilhado 5 dias/semana, educador físico 6 dias/semana, bioarquitetura, biofilia e
vegetação do Cerrado — inspirado nas Blue Zones. (Localização em estudo, não divulgada no formulário.)

## Conteúdo

| Arquivo | Descrição |
|---|---|
| `criarPesquisaPirenopolis.gs` | Apps Script que gera o Google Forms completo (v2.1, questionário definitivo do cliente) + planilha de respostas. **Fonte da verdade** do questionário. |
| `ajustes-v2_1.gs` | Ajustes aplicados ao Forms existente via `FormApp.openById` (correções do cliente de 30/08), sem trocar o link. |
| `questionario-piloto.md` | As 68 perguntas em texto legível (gerado do `.gs`), para revisão. |
| `form-demo.html` | Protótipo de formulário customizado "Uma Nova Forma de Viver": uma pergunta por tela, revelação sequencial, céu do Cerrado que avança com o progresso, fotos embutidas (Graydient). |
| `site/index.html` | Versão standalone do protótipo pronta para deploy (Vercel/Netlify) — doctype + viewport. |
| `fotos/` | Pipeline das imagens (Graydient flux): `gerar_fotos.py` gera, `injetar.js` comprime/injeta como data URI no HTML. |
| `prints-correcoes-v2_1/` | Evidências das 5 correções do cliente aplicadas no Forms. |

## Links do Google Forms (v2.1)

- Responder: https://docs.google.com/forms/d/e/1FAIpQLSdx4d6qnOj844qD7TuXooW26GzB-rqxNUtqq7j4Yeldjs5t4A/viewform
- Edição: https://docs.google.com/forms/d/1WlOJmismt46sEDLXVadPsWWeNCKR-zXbBoWmtEQEV1Q/edit
- Planilha de respostas: https://docs.google.com/spreadsheets/d/1JcrRNl5PhVnqTBItfvQbRMcqe6fu5EMbUlRlxXd4BG4/edit

> Atenção: cada execução de `criarPesquisaPirenopolis()` cria um formulário NOVO (link novo).
> Ajustes finos no form existente: editar direto no Forms ou seguir o padrão de `ajustes-v2_1.gs`.

## Protótipo custom

Abra `site/index.html` no navegador (funciona offline) ou publique a pasta `site/` no Vercel/Netlify.
Regenerar fotos: `python fotos/gerar_fotos.py` (token Graydient no `.env` do new-flow) e depois
`node fotos/injetar.js`.
