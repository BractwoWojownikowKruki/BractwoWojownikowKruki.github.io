export const site = {
  title: 'Bractwo Wojowników Kruki',
  description: 'Grupa rekonstrukcji historycznej odtwarzająca wikingów.',

  facebookPageUrl: 'https://www.facebook.com/bwkruki',
  instagramProfileUrl: 'https://www.instagram.com/kruki.brotherhood',

  // Strona główna: FB dominujący + opcjonalny wąski pasek IG.
  showInstagramSidebar: true,

  // Jeśli chcesz prawdziwą "siatkę" z IG bez API, wklej tutaj
  // kod widgetu (iframe/script) od wybranego dostawcy.
  // (Pusty string = pokaż tylko link do profilu.)
  instagramEmbedHtml: '',

  nav: {
    about: {
      label: 'O nas',
      href: '/o-nas',
      children: [
        { label: 'Wojownicy', href: '/o-nas/wojownicy' },
        { label: 'Kandydaci', href: '/o-nas/kandydaci' },
        { label: 'Niewiasty', href: '/o-nas/niewiasty' },
        { label: 'Emeryci', href: '/o-nas/emeryci' }
      ]
    },
    offer: { label: 'Oferta / Kontakt', href: '/oferta-kontakt' },
    tournament: { label: 'Kruczy turniej', href: '/kruczy-turniej' }
  }
} as const;

export type MemberSection = 'wojownicy' | 'kandydaci' | 'niewiasty' | 'emeryci';
