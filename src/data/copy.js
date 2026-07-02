// All displayed copy — transcribed verbatim from reference/index.html
// (the UI/UX source of truth per the implementation plan).
// PRD copy blocks in English are NOT used; index.html wins for words/visuals.

export const copy = {
  title: 'Untuk Kakak Cantik — Stasya Annesty',

  s1: {
    pageTab: 'hal. 01',
    eyebrow: 'Untuk My very very very biutiful pro max plus Girl',
    h1: 'Halo Perempuan yang di Jumat ini terlihat paling cantik di kantor bahkan di dunia',
    who: 'Stasya Annesty.',
    ask: 'Hmm… kamu masih marah ya?',
    gifAlt: 'Kucing strawberry-cat lucu lagi semangat',
    cta: 'Iya, lanjut baca dulu…',
  },

  s2: {
    pageTab: 'hal. 02',
    name: 'Adit',
    status: 'sedang mengetik…',
    lines: [
      'Aku tadi niatnya bercanda…',
      'Aku cuma pura-pura ngambek…',
      'Tapi ternyata kamu yang beneran ngambek…',
      { text: 'Dan aku kalah.', lost: true },
    ],
    sorry: 'Maaf ya…',
  },

  s3: {
    pageTab: 'hal. 03',
    h2: 'Aku nggak pernah keganggu sama kamu.',
    body: 'Aku nggak kesel karena kamu banyak ngomong. Aku justru senang waktu kamu cerita, nanya hal random, atau nge-request apa pun ke aku.',
    moments: [
      { b: 'Kamu cerita', span: 'Aku diem-diem senyum dengerin.' },
      { b: 'Kamu nanya random', span: 'Pertanyaan paling ngalir pun aku suka.' },
      { b: 'Kamu request sesuatu', span: 'Bikin aku merasa dibutuhin.' },
      { b: 'Aku merasa berguna', span: 'Buat kamu, itu cukup buat aku.' },
    ],
    plea: 'Plisssss bangetttt janjiiii jangan berubah aku pengen kamu kaya kemarin aku seneng bangetttt kalo di gituinnnnn',
  },

  s4: {
    pageTab: 'hal. 04',
    h2: 'Dari semalam aku kepikiran terus sampai susah tidur, hehe.',
    body: 'Iya, aku overthinking sendiri karena takut kamu masih marah sama aku.\nTerus akhirnya aku bikin ini deh.',
    thoughts: [
      'Dia masih marah nggak ya?',
      'Aduh aku salah…',
      'Gimana cara minta maaf yang lucu ya?',
      'Bikin ini aja deh…',
    ],
    gifAlt: 'Kucing midnight lagi begadang overthinking belum tidur',
    cta: 'Lihat hasil overthinking-ku',
  },

  s5: {
    pageTab: 'hal. 05',
    h2: 'Aku bikin ini khusus buat kamu.',
    body: 'Aku harap hal kecil ini bisa bikin marah kamu sedikit reda, bikin kamu senyum lagi, dan bikin kamu mau maafin aku.',
    loadLabel: 'Apology loading…',
    statuses: [
      'menyiapkan permintaan maaf…',
      'merangkai kata-kata yang jujur…',
      'menimbang rasa salah…',
      'mencari cara biar kamu senyum…',
      'mengetik dengan tulus…',
    ],
    finalStatus: 'Status: masih berharap dimaafin kakak cantik',
    done: 'done',
  },

  s6: {
    pageTab: 'hal. 06 ♡',
    h2: ['Jadi…', 'Mau ya?'],
    name: 'Maafin Aditya Ardiansyah Ramadhan ini.',
    forgiveBtn: [
      'Iya deh, aku maafin kamu.',
      'Tapi jangan ngelakuin hal itu lagi ya ke aku.',
    ],
    ngambek: 'Nggak mau, aku mau ngambek seminggu lagi.',
    funny:
      'Eh, balon ngambek-nya pecah! Waktu ngambek-nya kelihatannya udah abis deh… yuk, maafin aku?',
    finalH2: 'Yeay…',
    finalP:
      'Makasih ya, kakak cantik. Aku senang banget kamu mau maafin aku.\nAku janji bakal lebih hati-hati, lebih peka, dan nggak pura-pura ngambek dengan cara yang bikin kamu sedih lagi.',
    gifLabel: 'Kondisi Adit saat ini',
    gifAlt: 'Kucing mochi peachcat lucu lagi senyum senang',
  },
}

// PRD §7 names the final GIF `final-adit.gif`; the provided asset is
// `mochi-peachcat-cute-cat.gif`. Treat the mochi GIF as the alias for
// `final-adit.gif` until the owner drops in a true final GIF (DEP-04).
//
// Paths are prefixed with BASE_URL so they resolve correctly under the
// GitHub Pages base path (/apologies-web-app/). RISK-04.
const BASE = import.meta.env.BASE_URL // '/apologies-web-app/' in prod, '/' in some setups
export const GIFS = {
  opening: `${BASE}gifs/opening.gif`,
  overthinking: `${BASE}gifs/mr42aipu-midnightgif300.gif`,
  final: `${BASE}gifs/mochi-peachcat-cute-cat.gif`,
}
