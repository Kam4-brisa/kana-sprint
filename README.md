# Kana Sprint

Aprenda japonês em sessões de 2 minutos. O Kana Sprint foi pensado para quem tem TDAH: rodadas curtas, um próximo passo sempre claro, resposta na hora e nada de excesso na tela.

## O que tem

- **Trilha guiada** com 85 lições: hiragana, katakana (com tenten, maru e combinações como きゃ), 115 kanji e 196 palavras em 24 temas.
- **Repetição espaçada:** o que você erra volta mais vezes, o que você domina aparece menos.
- **Tipos de pergunta:** reconhecer, achar o caractere, ouvir e escolher, e digitar a leitura.
- **Escrita:** desenhe cada traço na ordem certa e o app confere posição e sentido de cada um.
- **Gramática:** 10 tópicos com explicação curta e exercícios.
- **Simulados JLPT** do N5 ao N1, nos modos treino e prova, com tempo opcional e furigana.
- **Treinos livres:** revisão, ouvir, digitar, mistura, os pares que você mais confunde, desafio geral e categoria completa.
- **Modo romaji:** troca o português pela leitura, para fixar a pronúncia.
- **Progresso:** meta diária, sequência de dias, níveis e estatísticas.
- **Pensado para TDAH:** pausa automática ao trocar de aba, opção sem cronômetro, atalhos de teclado e áudio que liga e desliga num toque.

O progresso fica salvo no `localStorage` do navegador.

## Como rodar

Requer Node.js 20 ou mais novo.

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (por padrão http://localhost:5173).

## Scripts

| Comando           | O que faz                                                 |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento com recarregamento automático |
| `npm run build`   | Gera a versão de produção em `dist/`                      |
| `npm run preview` | Serve o `dist/` localmente                                |
| `npm test`        | Roda os testes (Vitest)                                   |
| `npm run lint`    | Verifica o código (ESLint)                                |
| `npm run format`  | Formata o código (Prettier)                               |

O `dist/` é estático e usa caminhos relativos, então funciona em qualquer servidor web.

## Estrutura

```
src/
  main.js              ponto de entrada: estilos, fontes, ícones e inicialização
  events.js            cliques, formulários, atalhos de teclado e pausa ao trocar de aba
  core/
    catalog.js         monta itens, lições e a ordem da trilha a partir dos dados
    store.js           progresso salvo (localStorage) e repetição espaçada
    state.js           estado da tela e da sessão atual (não é salvo)
    audio.js           voz em japonês, efeitos sonoros e vibração
    utils.js           utilitários de DOM e de dados
  data/                conteúdo puro, sem lógica
    kana.js  kanji.js  words.js  grammar.js  furigana.js  confusions.js
    exams/             um arquivo por nível do JLPT
  features/
    home.js            tela inicial
    table.js           tabelas de kana e kanji
    session/           lições e treinos: fluxo, perguntas, cronômetro
    exam/              simulados e furigana
    write/             escrita: dados de traços, geometria e tela
    challenge.js  confusions.js  grammar.js  stats.js  settings.js
  ui/                  efeitos visuais, tema e bloco de leituras do kanji
  styles/              CSS dividido por área, com tokens de tema claro e escuro
tests/                 testes de dados, catálogo, furigana e geometria
```

### Como adicionar conteúdo

- **Palavras:** acrescente um tema em `src/data/words.js` e coloque o id dele (`w-<id>`) em `ORDER` dentro de `src/core/catalog.js`.
- **Kanji:** acrescente a lição em `src/data/kanji.js`, as leituras em `KYOMI` e o id (`j-<id>`) em `ORDER`.
- **Simulados:** edite o arquivo do nível em `src/data/exams/`. A primeira opção de cada questão é sempre a correta, e a ordem é embaralhada na hora.

Os testes (`npm test`) conferem se tudo continua consistente: lições na trilha, opções sem repetição, leituras de furigana e kanji.

## Créditos

- Ordem dos traços: [KanjiVG](https://kanjivg.tagaini.net/), de Ulrich Apel, licença [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Os dados são baixados sob demanda e não fazem parte deste repositório.
- Ícones: [Phosphor Icons](https://phosphoricons.com/) (MIT).
- Fontes: [Outfit](https://fonts.google.com/specimen/Outfit) e [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) (SIL Open Font License).

Os simulados seguem o estilo do JLPT para treino e **não são provas oficiais**.

## Licença

Código sob a licença [MIT](LICENSE).
