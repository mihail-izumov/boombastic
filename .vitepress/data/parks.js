/* ═══════════════════════════════════════════════════════════════
   РЕЕСТР ПАРКОВ — единый источник данных для модалки «Войти»

   Как добавить парк:
   1. Скопировать блок ниже, поменять id / name / address / accent.
   2. Пока ЛК нет — lk.status: 'soon', url оставить пустым.
   3. Когда ЛК заработает — lk.status: 'active' + url.

   lk.status:
     'active' — ЛК работает, кнопка ведёт на url (новая вкладка)
     'soon'   — парк виден в модалке, кнопка неактивна, плашка «СКОРО»
     'none'   — парк в модалке не показывается вообще

   Цвета парков совпадают с ParksPage.vue (accent / tagColor).
   ═══════════════════════════════════════════════════════════════ */

export const parks = [
  {
    id: 'ohta',
    name: 'Охта Молл',
    address: 'Брантовская дор., 3',
    accent: '#FF0080',
    lk: { status: 'active', url: 'https://lk.b00m.fun' },
  },
  {
    id: 'piterland',
    name: 'Питерлэнд',
    address: 'Приморский пр., 72',
    accent: '#00FF88',
    lk: { status: 'active', url: 'https://ptl.b00m.fun' },
  },
  {
    id: 'june',
    name: 'Июнь',
    address: 'Индустриальный просп., 24',
    accent: '#00D4FF',
    lk: { status: 'active', url: 'https://jun.b00m.fun/' },
  },
]

/* Парки, попадающие в модалку «Войти» */
export const lkParks = parks.filter((p) => p.lk.status !== 'none')

/* Ключ localStorage — согласован с UI-гайдом, раздел 15.6 */
export const PARK_STORAGE_KEY = 'boom_park'
