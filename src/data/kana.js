// Kana rows: [romaji, hiragana, katakana]
export const ROWS = [
  [
    "vog",
    "Vogais",
    [
      ["a", "あ", "ア"],
      ["i", "い", "イ"],
      ["u", "う", "ウ"],
      ["e", "え", "エ"],
      ["o", "お", "オ"],
    ],
  ],
  [
    "k",
    "Linha do K",
    [
      ["ka", "か", "カ"],
      ["ki", "き", "キ"],
      ["ku", "く", "ク"],
      ["ke", "け", "ケ"],
      ["ko", "こ", "コ"],
    ],
  ],
  [
    "s",
    "Linha do S",
    [
      ["sa", "さ", "サ"],
      ["shi", "し", "シ"],
      ["su", "す", "ス"],
      ["se", "せ", "セ"],
      ["so", "そ", "ソ"],
    ],
  ],
  [
    "t",
    "Linha do T",
    [
      ["ta", "た", "タ"],
      ["chi", "ち", "チ"],
      ["tsu", "つ", "ツ"],
      ["te", "て", "テ"],
      ["to", "と", "ト"],
    ],
  ],
  [
    "n",
    "Linha do N",
    [
      ["na", "な", "ナ"],
      ["ni", "に", "ニ"],
      ["nu", "ぬ", "ヌ"],
      ["ne", "ね", "ネ"],
      ["no", "の", "ノ"],
    ],
  ],
  [
    "h",
    "Linha do H",
    [
      ["ha", "は", "ハ"],
      ["hi", "ひ", "ヒ"],
      ["fu", "ふ", "フ"],
      ["he", "へ", "ヘ"],
      ["ho", "ほ", "ホ"],
    ],
  ],
  [
    "m",
    "Linha do M",
    [
      ["ma", "ま", "マ"],
      ["mi", "み", "ミ"],
      ["mu", "む", "ム"],
      ["me", "め", "メ"],
      ["mo", "も", "モ"],
    ],
  ],
  [
    "y",
    "Linha do Y",
    [
      ["ya", "や", "ヤ"],
      ["yu", "ゆ", "ユ"],
      ["yo", "よ", "ヨ"],
    ],
  ],
  [
    "r",
    "Linha do R",
    [
      ["ra", "ら", "ラ"],
      ["ri", "り", "リ"],
      ["ru", "る", "ル"],
      ["re", "れ", "レ"],
      ["ro", "ろ", "ロ"],
    ],
  ],
  [
    "w",
    "W e N",
    [
      ["wa", "わ", "ワ"],
      ["wo", "を", "ヲ"],
      ["n", "ん", "ン"],
    ],
  ],
  [
    "g",
    "Linha do G",
    [
      ["ga", "が", "ガ"],
      ["gi", "ぎ", "ギ"],
      ["gu", "ぐ", "グ"],
      ["ge", "げ", "ゲ"],
      ["go", "ご", "ゴ"],
    ],
  ],
  [
    "z",
    "Linha do Z",
    [
      ["za", "ざ", "ザ"],
      ["ji", "じ", "ジ"],
      ["zu", "ず", "ズ"],
      ["ze", "ぜ", "ゼ"],
      ["zo", "ぞ", "ゾ"],
    ],
  ],
  [
    "d",
    "Linha do D",
    [
      ["da", "だ", "ダ"],
      ["di", "ぢ", "ヂ"],
      ["du", "づ", "ヅ"],
      ["de", "で", "デ"],
      ["do", "ど", "ド"],
    ],
  ],
  [
    "b",
    "Linha do B",
    [
      ["ba", "ば", "バ"],
      ["bi", "び", "ビ"],
      ["bu", "ぶ", "ブ"],
      ["be", "べ", "ベ"],
      ["bo", "ぼ", "ボ"],
    ],
  ],
  [
    "p",
    "Linha do P",
    [
      ["pa", "ぱ", "パ"],
      ["pi", "ぴ", "ピ"],
      ["pu", "ぷ", "プ"],
      ["pe", "ぺ", "ペ"],
      ["po", "ぽ", "ポ"],
    ],
  ],
];

// Combinations (yoon): small ya/yu/yo
export const YOON = [
  [
    "yo1",
    "Combinações K, S e C",
    [
      ["kya", "きゃ", "キャ"],
      ["kyu", "きゅ", "キュ"],
      ["kyo", "きょ", "キョ"],
      ["sha", "しゃ", "シャ"],
      ["shu", "しゅ", "シュ"],
      ["sho", "しょ", "ショ"],
      ["cha", "ちゃ", "チャ"],
      ["chu", "ちゅ", "チュ"],
      ["cho", "ちょ", "チョ"],
    ],
  ],
  [
    "yo2",
    "Combinações N, H e M",
    [
      ["nya", "にゃ", "ニャ"],
      ["nyu", "にゅ", "ニュ"],
      ["nyo", "にょ", "ニョ"],
      ["hya", "ひゃ", "ヒャ"],
      ["hyu", "ひゅ", "ヒュ"],
      ["hyo", "ひょ", "ヒョ"],
      ["mya", "みゃ", "ミャ"],
      ["myu", "みゅ", "ミュ"],
      ["myo", "みょ", "ミョ"],
    ],
  ],
  [
    "yo3",
    "Combinações R, G e J",
    [
      ["rya", "りゃ", "リャ"],
      ["ryu", "りゅ", "リュ"],
      ["ryo", "りょ", "リョ"],
      ["gya", "ぎゃ", "ギャ"],
      ["gyu", "ぎゅ", "ギュ"],
      ["gyo", "ぎょ", "ギョ"],
      ["ja", "じゃ", "ジャ"],
      ["ju", "じゅ", "ジュ"],
      ["jo", "じょ", "ジョ"],
    ],
  ],
  [
    "yo4",
    "Combinações B e P",
    [
      ["bya", "びゃ", "ビャ"],
      ["byu", "びゅ", "ビュ"],
      ["byo", "びょ", "ビョ"],
      ["pya", "ぴゃ", "ピャ"],
      ["pyu", "ぴゅ", "ピュ"],
      ["pyo", "ぴょ", "ピョ"],
    ],
  ],
];

// Mnemonics for each hiragana
export const MNH = {
  あ: "Uma cruz com um laço embaixo. Imagine alguém de boca aberta: 'Aaah!'",
  い: "Dois tracinhos lado a lado, como dois 'i' sem o pingo.",
  う: "Um tracinho em cima e uma curva: uma orelha ouvindo 'uuu'.",
  え: "Parece alguém dançando com a perna dobrada: 'Eeei!'",
  お: "Quase igual ao あ, mas com um tracinho extra do lado: 'Oh!'",
  か: "Uma pessoa com uma espada e um tracinho: 'Kaa!' de karatê.",
  き: "Parece uma chave antiga: 'ki'.",
  く: "O bico de um pássaro cantando 'ku ku'.",
  け: "Um poste com uma bandeira balançando: 'que' vento!",
  こ: "Duas minhocas deitadas fazendo 'co'cegas uma na outra.",
  さ: "Parece um 'sa'ca-rolhas torto.",
  し: "Um anzol de pesca. Peixe se pega em silêncio: 'shhh'.",
  す: "Uma corda com um nó no meio: 'su'spensa.",
  せ: "Uma boca aberta mostrando um dente: 'se' liga!",
  そ: "Um zigue-zague, como 'so'rvete escorrendo.",
  た: "Dá para ler um 't' e um 'a' juntos: ta.",
  ち: "Parece um número 5 de costas. Um 5 chique: 'chi'.",
  つ: "Uma onda grande se formando: 'tsu'nami.",
  て: "Um 'T' torto e preguiçoso: 'te'.",
  と: "Um dedo do pé com um espinho espetado: 'to'pada!",
  な: "Uma cruz e um laço, como uma freira rezando: 'na'.",
  に: "Um traço e um sinal de igual. Lembra 'N' e 'i' juntos: ni.",
  ぬ: "Macarrão enrolado com um laço no final: 'nu'dles.",
  ね: "Um gato com o rabo enrolado. E gato em japonês é 'ne'ko.",
  の: "Um sinal de proibido: 'no'!",
  は: "Uma pessoa ao lado de outra que ri: 'ha ha'.",
  ひ: "Um sorrisão de orelha a orelha: 'hi hi'.",
  ふ: "O Monte Fuji com nuvens em volta: 'fu'.",
  へ: "Uma montanha baixinha e simples: 'he'.",
  ほ: "O は com um chapéu extra. Papai Noel: 'ho ho ho'.",
  ま: "Uma mamãe com o bebê no colo: 'ma'.",
  み: "Um 'm' escrito à mão com um rabinho: 'mi'.",
  む: "Uma vaca com chifre fazendo 'muuu'.",
  め: "Um olho com a sobrancelha. E olho em japonês é 'me'.",
  も: "Um anzol com duas iscas: o peixe 'mo'rde.",
  や: "Um iaque com chifres: 'ya'.",
  ゆ: "Um peixe nadando em formato de U: 'yu'.",
  よ: "Um ioiô pendurado no dedo: 'yo'.",
  ら: "Um ratinho sentado de lado: 'ra'.",
  り: "Dois rios descendo lado a lado: 'ri'o.",
  る: "Uma rua que dá a volta e termina num laço: 'ru'.",
  れ: "Uma pessoa ajoelhada 're'zando.",
  ろ: "Igual ao る, mas sem o laço. Uma 'ro'da que perdeu o freio.",
  わ: "Alguém de boca aberta dizendo 'uau': 'wa'.",
  を: "Uma pessoa caindo da bicicleta: 'uoo!'. Hoje se fala só 'o'.",
  ん: "Um 'n' escrito à mão. É o único som que é só consoante.",
};

// Specific katakana mnemonics (others fall back to the hiragana equivalent)
export const MNK = {
  ア: "Mesmo som de あ (a). Parece um A torto.",
  カ: "Mesmo som de か (ka), só que sem o tracinho do lado.",
  キ: "Mesmo som de き (ki), sem a curva de baixo.",
  シ: "Mesmo som de し (shi). Tracinhos à esquerda e o traço longo sobe de baixo, como um sorriso de lado.",
  ツ: "Mesmo som de つ (tsu). Tracinhos em cima e o traço longo desce de cima, como uma onda caindo.",
  ソ: "Mesmo som de そ (so). O traço longo desce de cima. Não confunda com ン.",
  ン: "Mesmo som de ん (n). O traço longo sobe de baixo. Não confunda com ソ.",
  セ: "Mesmo som de せ (se), com o canto mais reto.",
  ト: "Mesmo som de と (to). Um poste com um galho.",
  ニ: "Mesmo som de に (ni). Dois traços, e 'ni' é dois em japonês.",
  ハ: "Mesmo som de は (ha). Duas linhas abrindo como uma risada.",
  ヘ: "Idêntico ao へ do hiragana. Esse vem de graça.",
  ミ: "Mesmo som de み (mi). Três traços, como três dedos.",
  モ: "Mesmo som de も (mo), sem o gancho.",
  ヤ: "Mesmo som de や (ya), o mesmo iaque, só que mais reto.",
  リ: "Quase igual ao り do hiragana, só que mais reto.",
  ロ: "Mesmo som de ろ (ro). Um quadrado, como uma boca aberta.",
  エ: "Mesmo som de え (e). Parece uma viga de construção.",
  オ: "Mesmo som de お (o). Uma cruz com uma perninha.",
};

// Accepted alternative spellings when typing romaji
export const ALT = {
  sha: ["sya"],
  shu: ["syu"],
  sho: ["syo"],
  cha: ["tya", "cya"],
  chu: ["tyu", "cyu"],
  cho: ["tyo", "cyo"],
  ja: ["zya", "jya"],
  ju: ["zyu", "jyu"],
  jo: ["zyo", "jyo"],
  wo: ["o"],
  n: ["nn"],
  di: ["ji", "dji"],
  du: ["zu", "dzu"],
  shi: ["si"],
  chi: ["ti"],
  tsu: ["tu"],
  fu: ["hu"],
  ji: ["zi"],
};

// Display labels for ambiguous sounds
export const LABEL = { di: "ji (di)", du: "zu (du)" };

// Sound used to avoid two correct answers among the options
export const SND = { di: "ji", du: "zu" };

// Base row for each dakuten/handakuten row
export const BASE = { g: "k", z: "s", d: "t", b: "h", p: "h" };
