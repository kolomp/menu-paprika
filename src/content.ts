export const locales = ['tr', 'zh', 'ko', 'en', 'es', 'ru'] as const

export type Locale = (typeof locales)[number]
export type RewardId = 'tea' | 'baklava' | 'coffee'
export type ReviewPlatformId = 'google' | 'tripadvisor'

type Copy = {
  backButton: string
  callCta: string
  changeLanguage: string
  claimBody: string
  claimTitle: string
  directReviewHint: string
  giftBody: string
  giftTitle: string
  googleCta: string
  instagramCta: string
  mapCta: string
  pageTitle: string
  platformOpened: string
  reviewBody: string
  reviewTitle: string
  spinAgain: string
  spinBody: string
  spinButton: string
  spinHint: string
  spinTitle: string
  spinningButton: string
  startButton: string
  stepClaim: string
  stepGift: string
  stepReview: string
  stepSpin: string
  stepWelcome: string
  tripadvisorCta: string
  welcomeBody: string
  welcomeTitle: string
  websiteCta: string
}

export type RewardDefinition = {
  accent: string
  burst: string
  id: RewardId
  labelByLocale: Record<Locale, string>
  segmentColor: string
  shortLabelByLocale: Record<Locale, string>
  staffInstructionByLocale: Record<Locale, string>
  weight: number
}

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
  ko: 'KO',
  ru: 'RU',
  tr: 'TR',
  zh: '中文',
}

export const localeTags: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-ES',
  ko: 'ko-KR',
  ru: 'ru-RU',
  tr: 'tr-TR',
  zh: 'zh-CN',
}

export const links = {
  googleReview: 'https://g.page/r/CQat3aQfKuExEBM/review',
  instagram: 'https://www.instagram.com/paprika_cappadocia/',
  maps:
    'https://www.google.com/maps?sca_esv=a5b03d48c1dcd4f4&sca_upv=1&sxsrf=ACQVn0_ZX9xrK5BFU0V-pUOytSDJVKPgKw:1712831811554&iflsig=ANes7DEAAAAAZhfLUxg8za7ToiK2dYbQM4qEByS3uZ3l&uact=5&gs_lp=Egdnd3Mtd2l6IhZQYXByaWthIEJ1cmdlciAmIFBhc3RhMgwQIxiABBiKBRgTGCcyBBAjGCcyBBAjGCcyDhAuGIAEGMsBGMcBGK8BMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeSMgCUABYAHAAeACQAQCYAcEBoAHBAaoBAzAuMbgBA8gBAPgBAvgBAZgCAaACygGYAwCSBwMyLTGgB7UN&um=1&ie=UTF-8&fb=1&gl=tr&sa=X&geocode=Ke1QyBT9aSoVMQat3aQfKuEx&daddr=Yukar%C4%B1+Mahalle,+Fatih+Cd.+No:20,+50420+U%C3%A7hisar/Nev%C5%9Fehir+Merkez/Nev%C5%9Fehir',
  phone: 'tel:+905314508560',
  tripadvisorReview:
    'https://www.tripadvisor.com/UserReviewEdit-g297988-d19839730-Paprika_Burger_Pasta-Uchisar_Cappadocia.html',
  website: 'https://paprikacappadocia.com/',
} as const

export const rewardPool: RewardDefinition[] = [
  {
    accent: '#ffd35d',
    burst: 'rgba(255, 211, 93, 0.3)',
    id: 'tea',
    labelByLocale: {
      en: 'Turkish Tea',
      es: 'Té Turco',
      ko: '터키 차',
      ru: 'Турецкий чай',
      tr: 'Türk Çayı',
      zh: '土耳其茶',
    },
    segmentColor: '#d7a52f',
    shortLabelByLocale: {
      en: 'Tea',
      es: 'Té',
      ko: '차',
      ru: 'Чай',
      tr: 'Çay',
      zh: '茶',
    },
    staffInstructionByLocale: {
      en: 'Show this screen and receive 1 Turkish tea.',
      es: 'Muestra esta pantalla y recibe 1 té turco.',
      ko: '이 화면을 보여주고 터키 차 1잔을 받으세요.',
      ru: 'Покажите этот экран и получите 1 турецкий чай.',
      tr: 'Bu ekranı göster ve 1 Türk Çayı al.',
      zh: '出示此页面即可领取 1 杯土耳其茶。',
    },
    weight: 5,
  },
  {
    accent: '#f06b4a',
    burst: 'rgba(240, 107, 74, 0.3)',
    id: 'baklava',
    labelByLocale: {
      en: 'Baklava',
      es: 'Baklava',
      ko: '바클라바',
      ru: 'Баклава',
      tr: 'Baklava',
      zh: '巴克拉瓦',
    },
    segmentColor: '#d55333',
    shortLabelByLocale: {
      en: 'Bak',
      es: 'Bak',
      ko: '바클',
      ru: 'Бак',
      tr: 'Bak',
      zh: '甜',
    },
    staffInstructionByLocale: {
      en: 'Show this screen and receive 1 baklava treat.',
      es: 'Muestra esta pantalla y recibe 1 porción de baklava.',
      ko: '이 화면을 보여주고 바클라바 1개를 받으세요.',
      ru: 'Покажите этот экран и получите 1 порцию баклавы.',
      tr: 'Bu ekranı göster ve 1 porsiyon baklava al.',
      zh: '出示此页面即可领取 1 份巴克拉瓦。',
    },
    weight: 2,
  },
  {
    accent: '#a86b3b',
    burst: 'rgba(168, 107, 59, 0.3)',
    id: 'coffee',
    labelByLocale: {
      en: 'Coffee',
      es: 'Café',
      ko: '커피',
      ru: 'Кофе',
      tr: 'Kahve',
      zh: '咖啡',
    },
    segmentColor: '#85502b',
    shortLabelByLocale: {
      en: 'Coffee',
      es: 'Café',
      ko: '커피',
      ru: 'Кофе',
      tr: 'Kahve',
      zh: '咖啡',
    },
    staffInstructionByLocale: {
      en: 'Show this screen and receive 1 coffee.',
      es: 'Muestra esta pantalla y recibe 1 café.',
      ko: '이 화면을 보여주고 커피 1잔을 받으세요.',
      ru: 'Покажите этот экран и получите 1 кофе.',
      tr: 'Bu ekranı göster ve 1 kahve al.',
      zh: '出示此页面即可领取 1 杯咖啡。',
    },
    weight: 3,
  },
]

export const messages: Record<Locale, Copy> = {
  en: {
    backButton: 'Back',
    callCta: 'Call',
    changeLanguage: 'Change language',
    claimBody: 'Your gift stays on the screen. Show it directly to the Paprika team for delivery.',
    claimTitle: 'Show this page to the team',
    directReviewHint: 'Both buttons go straight to the review page.',
    giftBody: 'Your reward just exploded onto the screen. Move to the next page and open the direct review link.',
    giftTitle: 'You unlocked {reward}',
    googleCta: 'Go to Google review',
    instagramCta: 'Instagram',
    mapCta: 'Directions',
    pageTitle: 'Paprika Spin | Paprika Burger & Pasta',
    platformOpened: 'Opened',
    reviewBody: 'Choose one platform. Each button opens the direct review page for Paprika.',
    reviewTitle: 'Pick the review page',
    spinAgain: 'Spin again',
    spinBody: 'Tap the center and the wheel will land on tea, baklava, or coffee.',
    spinButton: 'Spin',
    spinHint: 'Tea 50% · Coffee 30% · Baklava 20%',
    spinTitle: 'Step 2: Spin the wheel',
    spinningButton: 'Spinning...',
    startButton: 'Start',
    stepClaim: 'Claim',
    stepGift: 'Gift',
    stepReview: 'Review',
    stepSpin: 'Spin',
    stepWelcome: 'Start',
    tripadvisorCta: 'Go to TripAdvisor review',
    welcomeBody: 'Mobile-first reward flow for Paprika Burger & Pasta. Start and move page by page.',
    welcomeTitle: 'Spin. Win. Review. Claim.',
    websiteCta: 'Website',
  },
  es: {
    backButton: 'Atrás',
    callCta: 'Llamar',
    changeLanguage: 'Cambiar idioma',
    claimBody: 'Tu regalo queda en pantalla. Muéstralo directamente al equipo de Paprika para recibirlo.',
    claimTitle: 'Muestra esta página al equipo',
    directReviewHint: 'Ambos botones van directamente a la página de reseña.',
    giftBody: 'Tu premio acaba de explotar en pantalla. Pasa a la siguiente página y abre el enlace directo.',
    giftTitle: 'Has desbloqueado {reward}',
    googleCta: 'Ir a reseña de Google',
    instagramCta: 'Instagram',
    mapCta: 'Ruta',
    pageTitle: 'Paprika Spin | Paprika Burger & Pasta',
    platformOpened: 'Abierto',
    reviewBody: 'Elige una plataforma. Cada botón abre la página directa de reseña de Paprika.',
    reviewTitle: 'Elige la página de reseña',
    spinAgain: 'Girar otra vez',
    spinBody: 'Toca el centro y la rueda caerá en té, baklava o café.',
    spinButton: 'Girar',
    spinHint: 'Té 50% · Café 30% · Baklava 20%',
    spinTitle: 'Paso 2: Gira la rueda',
    spinningButton: 'Girando...',
    startButton: 'Empezar',
    stepClaim: 'Canje',
    stepGift: 'Regalo',
    stepReview: 'Reseña',
    stepSpin: 'Spin',
    stepWelcome: 'Inicio',
    tripadvisorCta: 'Ir a reseña de TripAdvisor',
    welcomeBody: 'Flujo móvil de recompensa para Paprika Burger & Pasta. Empieza y avanza página por página.',
    welcomeTitle: 'Gira. Gana. Reseña. Reclama.',
    websiteCta: 'Web',
  },
  ko: {
    backButton: '뒤로',
    callCta: '전화',
    changeLanguage: '언어 변경',
    claimBody: '선물은 화면에 유지됩니다. Paprika 팀에게 바로 보여 주세요.',
    claimTitle: '이 페이지를 팀에게 보여 주세요',
    directReviewHint: '두 버튼 모두 리뷰 페이지로 바로 이동합니다.',
    giftBody: '당첨 선물이 화면에서 터졌습니다. 다음 페이지로 이동해 직접 리뷰 링크를 여세요.',
    giftTitle: '{reward} 당첨',
    googleCta: 'Google 리뷰로 이동',
    instagramCta: 'Instagram',
    mapCta: '길찾기',
    pageTitle: 'Paprika Spin | Paprika Burger & Pasta',
    platformOpened: '열림',
    reviewBody: '플랫폼 하나를 선택하세요. 각 버튼은 Paprika 리뷰 페이지로 바로 이동합니다.',
    reviewTitle: '리뷰 페이지 선택',
    spinAgain: '다시 돌리기',
    spinBody: '가운데를 누르면 차, 바클라바 또는 커피에 멈춥니다.',
    spinButton: '돌리기',
    spinHint: '차 50% · 커피 30% · 바클라바 20%',
    spinTitle: '2단계: 휠 돌리기',
    spinningButton: '회전 중...',
    startButton: '시작',
    stepClaim: '수령',
    stepGift: '선물',
    stepReview: '리뷰',
    stepSpin: '스핀',
    stepWelcome: '시작',
    tripadvisorCta: 'TripAdvisor 리뷰로 이동',
    welcomeBody: 'Paprika Burger & Pasta를 위한 모바일 보상 플로우입니다. 페이지별로 진행하세요.',
    welcomeTitle: '돌리고. 당첨되고. 리뷰하고. 받으세요.',
    websiteCta: '웹사이트',
  },
  ru: {
    backButton: 'Назад',
    callCta: 'Позвонить',
    changeLanguage: 'Сменить язык',
    claimBody: 'Подарок остается на экране. Покажите его команде Paprika напрямую.',
    claimTitle: 'Покажите эту страницу команде',
    directReviewHint: 'Обе кнопки ведут сразу на страницу отзыва.',
    giftBody: 'Ваш приз взорвался на экране. Перейдите на следующую страницу и откройте прямую ссылку.',
    giftTitle: 'Вы выиграли {reward}',
    googleCta: 'Перейти к отзыву Google',
    instagramCta: 'Instagram',
    mapCta: 'Маршрут',
    pageTitle: 'Paprika Spin | Paprika Burger & Pasta',
    platformOpened: 'Открыто',
    reviewBody: 'Выберите одну платформу. Каждая кнопка ведет прямо на страницу отзыва Paprika.',
    reviewTitle: 'Выберите страницу отзыва',
    spinAgain: 'Крутить снова',
    spinBody: 'Нажмите в центр, и колесо остановится на чае, баклаве или кофе.',
    spinButton: 'Крутить',
    spinHint: 'Чай 50% · Кофе 30% · Баклава 20%',
    spinTitle: 'Шаг 2: Крутите колесо',
    spinningButton: 'Крутится...',
    startButton: 'Начать',
    stepClaim: 'Получение',
    stepGift: 'Подарок',
    stepReview: 'Отзыв',
    stepSpin: 'Spin',
    stepWelcome: 'Старт',
    tripadvisorCta: 'Перейти к отзыву TripAdvisor',
    welcomeBody: 'Мобильный сценарий награды для Paprika Burger & Pasta. Идите шаг за шагом.',
    welcomeTitle: 'Крути. Выигрывай. Отзывайся. Получай.',
    websiteCta: 'Сайт',
  },
  tr: {
    backButton: 'Geri',
    callCta: 'Ara',
    changeLanguage: 'Dili degistir',
    claimBody: 'Hediyen ekranda kaliyor. Dogrudan Paprika ekibine goster ve teslim al.',
    claimTitle: 'Bu sayfayi ekibe goster',
    directReviewHint: 'Iki buton da direkt yorum sayfasina gider.',
    giftBody: 'Odulun ekranda patlayarak acildi. Sonraki sayfaya gecip direkt yorum linkini ac.',
    giftTitle: '{reward} kazandin',
    googleCta: 'Google yorumuna git',
    instagramCta: 'Instagram',
    mapCta: 'Yol tarifi',
    pageTitle: 'Paprika Spin | Paprika Burger & Pasta',
    platformOpened: 'Acilan',
    reviewBody: 'Bir platform sec. Her buton Paprika icin direkt yorum sayfasini acar.',
    reviewTitle: 'Yorum sayfasini sec',
    spinAgain: 'Tekrar cevir',
    spinBody: 'Ortaya dokun, cark cay, baklava ya da kahvede dursun.',
    spinButton: 'Cevir',
    spinHint: 'Cay %50 · Kahve %30 · Baklava %20',
    spinTitle: 'Adim 2: Carki cevir',
    spinningButton: 'Donuyor...',
    startButton: 'Basla',
    stepClaim: 'Teslim',
    stepGift: 'Odul',
    stepReview: 'Yorum',
    stepSpin: 'Spin',
    stepWelcome: 'Baslangic',
    tripadvisorCta: 'TripAdvisor yorumuna git',
    welcomeBody: 'Paprika Burger & Pasta icin mobil odakli odul akisi. Sayfa sayfa ilerle.',
    welcomeTitle: 'Cevir. Kazan. Yorumla. Al.',
    websiteCta: 'Web',
  },
  zh: {
    backButton: '返回',
    callCta: '电话',
    changeLanguage: '切换语言',
    claimBody: '礼物会一直留在屏幕上。直接向 Paprika 团队出示即可领取。',
    claimTitle: '向团队出示此页面',
    directReviewHint: '两个按钮都会直接进入点评页面。',
    giftBody: '你的奖品已经在屏幕上爆开显示。进入下一页并打开直接点评链接。',
    giftTitle: '你赢得了 {reward}',
    googleCta: '前往 Google 点评',
    instagramCta: 'Instagram',
    mapCta: '路线',
    pageTitle: 'Paprika Spin | Paprika Burger & Pasta',
    platformOpened: '已打开',
    reviewBody: '选择一个平台。每个按钮都会直接打开 Paprika 的点评页面。',
    reviewTitle: '选择点评页面',
    spinAgain: '再转一次',
    spinBody: '点击中心，转盘会停在茶、巴克拉瓦或咖啡上。',
    spinButton: '开始转动',
    spinHint: '茶 50% · 咖啡 30% · 巴克拉瓦 20%',
    spinTitle: '第 2 步：转动转盘',
    spinningButton: '转动中...',
    startButton: '开始',
    stepClaim: '领取',
    stepGift: '礼物',
    stepReview: '点评',
    stepSpin: '转盘',
    stepWelcome: '开始',
    tripadvisorCta: '前往 TripAdvisor 点评',
    welcomeBody: 'Paprika Burger & Pasta 的移动奖励流程。一步一步进入。',
    welcomeTitle: '转动。中奖。点评。领取。',
    websiteCta: '网站',
  },
}

export function resolveLocale(
  input?: readonly string[] | string | null,
): Locale {
  const firstLocale = Array.isArray(input) ? input[0] : input
  const normalized = (firstLocale ?? '').toLowerCase()

  if (normalized.startsWith('tr')) return 'tr'
  if (normalized.startsWith('zh')) return 'zh'
  if (normalized.startsWith('ko')) return 'ko'
  if (normalized.startsWith('es')) return 'es'
  if (normalized.startsWith('ru')) return 'ru'

  return 'en'
}
