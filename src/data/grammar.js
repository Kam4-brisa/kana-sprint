// Grammar topics. In every exercise the first option is the correct one; options are shuffled at runtime.
export const GRAM = [
  {
    id: "wa-ga",
    t: "は e が",
    d: "Assunto ou sujeito",
    e: "<b>は</b> marca o assunto da frase, sobre o que se está falando. <b>が</b> marca quem faz ou o que existe, e aparece com すき, わかる, ある, いる e em perguntas com だれ ou なに.",
    x: [
      ["わたしは がくせいです。", "Eu sou estudante."],
      ["だれが きましたか。", "Quem veio?"],
    ],
    q: [
      {
        q: "わたし（　）がくせいです。",
        o: ["は", "が", "を", "に"],
        ex: "は apresenta o assunto: sobre mim, sou estudante.",
      },
      {
        q: "だれ（　）きましたか。",
        o: ["が", "は", "を", "で"],
        ex: "Quando だれ é o sujeito, usa-se が.",
      },
      {
        q: "わたしは ねこ（　）すきです。",
        o: ["が", "を", "は", "に"],
        ex: "すき usa が para o que se gosta.",
      },
      {
        q: "つくえの うえに ほん（　）あります。",
        o: ["が", "を", "で", "へ"],
        ex: "Com ある, o que existe leva が.",
      },
      {
        q: "きょう（　）いい てんきですね。",
        o: ["は", "が", "を", "に"],
        ex: "は para o assunto: hoje, o tempo está bom.",
      },
      { q: "にほんご（　）わかりますか。", o: ["が", "を", "で", "へ"], ex: "わかる usa が." },
    ],
  },
  {
    id: "wo",
    t: "を",
    d: "O que recebe a ação",
    e: "<b>を</b> marca o objeto, o que recebe a ação: comer o quê, ver o quê. Também marca o lugar por onde se passa ou de onde se sai.",
    x: [
      ["みずを のみます。", "Bebo água."],
      ["こうえんを さんぽします。", "Passeio pelo parque."],
    ],
    q: [
      { q: "みず（　）のみます。", o: ["を", "が", "に", "で"], ex: "O que se bebe leva を." },
      { q: "テレビ（　）みます。", o: ["を", "に", "で", "へ"], ex: "O que se vê leva を." },
      { q: "てがみ（　）かきます。", o: ["を", "が", "で", "の"], ex: "O que se escreve leva を." },
      {
        q: "こうえん（　）さんぽします。",
        o: ["を", "に", "が", "の"],
        ex: "Lugar por onde se passeia leva を.",
      },
      {
        q: "はし（　）わたります。",
        o: ["を", "に", "で", "が"],
        ex: "Atravessar a ponte: o caminho percorrido leva を.",
      },
      {
        q: "８じに いえ（　）でます。",
        o: ["を", "で", "が", "の"],
        ex: "Sair de um lugar (でる) usa を.",
      },
    ],
  },
  {
    id: "ni",
    t: "に",
    d: "Hora, destino e para quem",
    e: "<b>に</b> marca a hora exata (7じに), o destino (がっこうに いく), onde algo está (へやに いる) e para quem (ともだちに あげる).",
    x: [
      ["７じに おきます。", "Acordo às 7."],
      ["ともだちに でんわします。", "Ligo para um amigo."],
    ],
    q: [
      { q: "７じ（　）おきます。", o: ["に", "で", "を", "が"], ex: "Hora exata leva に." },
      {
        q: "らいねん にほん（　）いきます。",
        o: ["に", "を", "で", "の"],
        ex: "Destino leva に (へ também serviria).",
      },
      {
        q: "へや（　）ねこが います。",
        o: ["に", "を", "で", "へ"],
        ex: "Onde algo está (いる, ある) leva に.",
      },
      {
        q: "ともだち（　）プレゼントを あげます。",
        o: ["に", "を", "で", "が"],
        ex: "Para quem se dá leva に.",
      },
      {
        q: "にちようび（　）えいがを みます。",
        o: ["に", "を", "が", "の"],
        ex: "Dia da semana leva に.",
      },
      { q: "バス（　）のります。", o: ["に", "を", "で", "が"], ex: "のる (embarcar) usa に." },
    ],
  },
  {
    id: "de",
    t: "で",
    d: "Onde acontece e com o quê",
    e: "<b>で</b> marca o lugar onde a ação acontece (としょかんで よむ) e o meio ou ferramenta usada (はしで たべる, バスで いく).",
    x: [
      ["としょかんで べんきょうします。", "Estudo na biblioteca."],
      ["はしで たべます。", "Como de hashi."],
    ],
    q: [
      {
        q: "レストラン（　）ばんごはんを たべます。",
        o: ["で", "に", "を", "へ"],
        ex: "Onde a ação acontece leva で.",
      },
      { q: "はし（　）たべます。", o: ["で", "を", "に", "が"], ex: "Ferramenta leva で." },
      {
        q: "でんしゃ（　）かいしゃへ いきます。",
        o: ["で", "に", "を", "が"],
        ex: "Meio de transporte leva で.",
      },
      {
        q: "にほんご（　）はなして ください。",
        o: ["で", "を", "に", "が"],
        ex: "Idioma usado leva で.",
      },
      {
        q: "こうえん（　）あそびます。",
        o: ["で", "に", "を", "へ"],
        ex: "Lugar onde se brinca leva で.",
      },
      {
        q: "ペン（　）なまえを かきます。",
        o: ["で", "を", "に", "の"],
        ex: "Com a caneta: ferramenta leva で.",
      },
    ],
  },
  {
    id: "no-mo-to",
    t: "の, も e と",
    d: "De, também, e/com",
    e: "<b>の</b> liga dois substantivos (わたしの ほん = meu livro). <b>も</b> significa também e entra no lugar de は, が ou を. <b>と</b> significa e entre substantivos, ou com alguém (ともだちと).",
    x: [
      ["わたしの かさです。", "É meu guarda-chuva."],
      ["パンと たまごを かいました。", "Comprei pão e ovo."],
    ],
    q: [
      {
        q: "これは わたし（　）かさです。",
        o: ["の", "も", "と", "に"],
        ex: "の liga: guarda-chuva de mim, meu.",
      },
      {
        q: "たなかさんは がくせいです。わたし（　）がくせいです。",
        o: ["も", "の", "と", "を"],
        ex: "も = também.",
      },
      {
        q: "パン（　）たまごを かいました。",
        o: ["と", "の", "も", "に"],
        ex: "と = e (lista completa).",
      },
      {
        q: "ともだち（　）えいがを みました。",
        o: ["と", "の", "を", "に"],
        ex: "と = com alguém.",
      },
      {
        q: "にほんご（　）せんせいは やさしいです。",
        o: ["の", "と", "も", "を"],
        ex: "の liga: professor de japonês.",
      },
      {
        q: "きのうも きょう（　）あめです。",
        o: ["も", "の", "と", "に"],
        ex: "も = também: ontem e hoje também.",
      },
    ],
  },
  {
    id: "masu",
    t: "Verbos em ます",
    d: "Presente, negativo e passado",
    e: "<b>ます</b>: presente ou futuro educado. <b>ません</b>: negativo. <b>ました</b>: passado. <b>ませんでした</b>: passado negativo. <b>ましょう</b>: vamos.",
    x: [
      ["きのう えいがを みました。", "Ontem vi um filme."],
      ["いっしょに いきましょう。", "Vamos juntos."],
    ],
    q: [
      {
        q: "きのう えいがを（　）。",
        o: ["みました", "みます", "みません", "みましょう"],
        ex: "きのう (ontem) pede o passado: みました.",
      },
      {
        q: "あした がっこうへ（　）。",
        o: ["いきます", "いきました", "いきませんでした", "いって"],
        ex: "あした (amanhã) usa a forma ます.",
      },
      {
        q: "ベジタリアンですから、にくを（　）。",
        o: ["たべません", "たべました", "たべましょう", "たべて"],
        ex: "Vegetariano: não como carne, たべません.",
      },
      {
        q: "いっしょに おちゃを（　）。",
        o: ["のみましょう", "のみました", "のみませんでした", "のんだ"],
        ex: "ましょう = vamos (convite).",
      },
      {
        q: "きのうは どこへも（　）。",
        o: ["いきませんでした", "いきます", "いきましょう", "いきません"],
        ex: "どこへも + negativo no passado: não fui a lugar nenhum.",
      },
      {
        q: "まいあさ コーヒーを（　）。",
        o: ["のみます", "のみました", "のみませんでした", "のみましょう"],
        ex: "Hábito (todo dia) usa ます.",
      },
    ],
  },
  {
    id: "adj",
    t: "Adjetivos い e な",
    d: "Como cada tipo muda",
    e: "Adjetivos <b>い</b> mudam no final: たかい, たかくない (negativo), たかかった (passado). Adjetivos <b>な</b> usam な antes de substantivo (しずかな へや) e じゃない no negativo. Cuidado: きれい e ゆうめい são do tipo な.",
    x: [
      ["この へやは しずかです。", "Este quarto é silencioso."],
      ["きのうは さむかったです。", "Ontem estava frio."],
    ],
    q: [
      {
        q: "この へやは（　）です。",
        o: ["しずか", "しずかな", "しずかい", "しずかく"],
        ex: "Antes de です, o adjetivo な fica sem な.",
      },
      {
        q: "（　）へやですね。",
        o: ["しずかな", "しずか", "しずかの", "しずかい"],
        ex: "Antes de substantivo, o adjetivo な leva な.",
      },
      {
        q: "この えいがは（　）。",
        o: ["おもしろくないです", "おもしろいじゃないです", "おもしろなくです", "おもしろないです"],
        ex: "Negativo de adjetivo い: troca い por くない.",
      },
      {
        q: "きのうは（　）です。",
        o: ["さむかった", "さむいでした", "さむくかった", "さむだった"],
        ex: "Passado de adjetivo い: troca い por かった.",
      },
      {
        q: "あの みせは（　）。",
        o: ["きれいじゃないです", "きれくないです", "きれいくないです", "きれいないです"],
        ex: "きれい parece い, mas é な: negativo きれいじゃない.",
      },
      {
        q: "（　）ひとですね。",
        o: ["しんせつな", "しんせつ", "しんせつい", "しんせつの"],
        ex: "しんせつ é な: しんせつな ひと.",
      },
    ],
  },
  {
    id: "te",
    t: "Forma て",
    d: "Pedidos e ações em sequência",
    e: "A forma <b>て</b> liga ações (おきて、かおを あらう) e faz pedidos com ください (まって ください). Grupo 1: かく → かいて, のむ → のんで, まつ → まって, はなす → はなして. Grupo 2: たべる → たべて. Irregulares: する → して, くる → きて, いく → いって.",
    x: [
      ["ちょっと まって ください。", "Espere um pouco, por favor."],
      ["あさ おきて、かおを あらいます。", "Acordo e lavo o rosto."],
    ],
    q: [
      {
        q: "ちょっと（　）ください。（まつ）",
        o: ["まって", "まちて", "まつて", "まった"],
        ex: "まつ termina em つ: vira って.",
      },
      {
        q: "ここに なまえを（　）ください。（かく）",
        o: ["かいて", "かきて", "かって", "かくて"],
        ex: "かく termina em く: vira いて.",
      },
      {
        q: "みずを（　）ください。（のむ）",
        o: ["のんで", "のみて", "のって", "のむて"],
        ex: "のむ termina em む: vira んで.",
      },
      {
        q: "あした また（　）ください。（くる）",
        o: ["きて", "くって", "こて", "くて"],
        ex: "くる é irregular: きて.",
      },
      {
        q: "あさごはんを（　）、がっこうへ いきます。（たべる）",
        o: ["たべて", "たべって", "たべりて", "たべた"],
        ex: "Grupo 2: tira る e põe て.",
      },
      {
        q: "にほんへ（　）、すしを たべたいです。（いく）",
        o: ["いって", "いきて", "いいて", "いくて"],
        ex: "いく é exceção: いって.",
      },
    ],
  },
  {
    id: "tai",
    t: "〜たい",
    d: "Querer fazer",
    e: "Raiz do verbo + <b>たい</b> = quero fazer. たべます → たべたい. Negativo: たくない. Passado: たかった. Funciona como um adjetivo い.",
    x: [
      ["すしが たべたいです。", "Quero comer sushi."],
      ["きょうは いきたくないです。", "Hoje não quero ir."],
    ],
    q: [
      {
        q: "すしが（　）です。",
        o: ["たべたい", "たべます", "たべるたい", "たべてたい"],
        ex: "Raiz (たべ) + たい.",
      },
      {
        q: "きょうは どこへも（　）。",
        o: ["いきたくないです", "いきたいないです", "いきないたいです", "いかたいです"],
        ex: "Negativo: たい vira たくない.",
      },
      {
        q: "こどもの とき、パイロットに（　）。",
        o: ["なりたかったです", "なりたいでした", "なりたくでした", "なるたかったです"],
        ex: "Passado: たい vira たかった.",
      },
      {
        q: "なにを（　）ですか。",
        o: ["のみたい", "のむたい", "のみたく", "のんでたい"],
        ex: "Raiz (のみ) + たい.",
      },
      {
        q: "しょうらい にほんで（　）です。",
        o: ["はたらきたい", "はたらくたい", "はたらきます", "はたらいたい"],
        ex: "Raiz (はたらき) + たい.",
      },
      {
        q: "いまは なにも（　）。",
        o: ["したくないです", "したいないです", "しないたいです", "するたくないです"],
        ex: "する: raiz し + たくない.",
      },
    ],
  },
  {
    id: "aru-iru",
    t: "ある e いる",
    d: "Existir, ter",
    e: "<b>いる</b> é para seres vivos que se movem (pessoas, animais). <b>ある</b> é para coisas, plantas e eventos.",
    x: [
      ["こうえんに こどもが います。", "Tem crianças no parque."],
      ["あした テストが あります。", "Amanhã tem prova."],
    ],
    q: [
      {
        q: "こうえんに こどもが（　）。",
        o: ["います", "あります", "です", "します"],
        ex: "Pessoas: いる.",
      },
      {
        q: "つくえの うえに ペンが（　）。",
        o: ["あります", "います", "です", "なります"],
        ex: "Coisas: ある.",
      },
      {
        q: "にわに さくらの きが（　）。",
        o: ["あります", "います", "です", "なります"],
        ex: "Plantas não se movem: ある.",
      },
      {
        q: "いけに さかなが（　）。",
        o: ["います", "あります", "です", "なります"],
        ex: "Animais: いる.",
      },
      {
        q: "あした テストが（　）。",
        o: ["あります", "います", "です", "なります"],
        ex: "Eventos: ある.",
      },
      {
        q: "きょうだいが ふたり（　）。",
        o: ["います", "あります", "です", "なります"],
        ex: "Ter irmãos (pessoas): いる.",
      },
    ],
  },
];
