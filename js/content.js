/* Amber's Dream: content and settings. Edit text here, not in the page code. */
window.AD = window.AD || {};

AD.config = {
  // Shows a "preview build" note on forms. Set to false when payments and uploads are connected.
  demo: true,
  fee: 10,
  deadline: 'Feb 28, 2027',
  charityPercent: 5,
  email: '[contest email address]',
  maxMB: 5,
  accept: ['.pdf', '.doc', '.docx', '.txt']
};

AD.nav = [
  { path: '/how-it-works', label: 'How it works' },
  { path: '/rules', label: 'The rules' },
  { path: '/prizes', label: 'Prizes' },
  { path: '/readers', label: 'Readers' },
  { path: '/faq', label: 'FAQ' }
];

AD.menu = [
  { path: '/enter', label: 'Enter for $10' },
  { path: '/how-it-works', label: 'How it works' },
  { path: '/rules', label: 'The rules' },
  { path: '/prizes', label: 'Prizes' },
  { path: '/readers', label: 'Readers' },
  { path: '/faq', label: 'FAQ' },
  { path: '/about', label: 'About' },
  { path: '/winners', label: 'Winners' },
  { path: '/contact', label: 'Contact' }
];

AD.icon = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"/></svg>'
};

AD.band = ['FIRST PAGE', 'LAST PAGE', 'ONLY $10', 'ANY GENRE', 'WRITERS WORLDWIDE', '5% TO CHARITY', 'TWICE A YEAR'];

AD.fees = [
  { label: 'A typical contest, early bird', amount: '$45', w: '47%', c: '#8A5A3C' },
  { label: 'A typical contest, late entry (or more)', amount: '$95+', w: '100%', c: '#5E2E08' },
  { label: "Amber's Dream", amount: '$10', w: '10.5%', c: '#E2A12F' }
];

AD.rows = [
  ['Entry fee', '$10'],
  ['You send', 'Your first full page and your last full page'],
  ['Genres', 'Any genre is welcome'],
  ['Writers', 'Seasoned and beginner, from all over the world'],
  ['First deadline', 'Feb 28, 2027'],
  ['How often', 'Twice a year'],
  ['Prizes', 'They grow with the number of entries'],
  ['Draws', 'Among all contestants'],
  ['Charity', '5% of the income'],
  ['Winners announced', 'In film publications, on movie sites and on this website'],
  ['Winners contacted', 'By email']
];

AD.steps = [
  { t: 'Choose your pages', p: 'Pick the first full page and the last full page of your screenplay. Any genre, any story.', tag: 'Any genre' },
  { t: 'Enter and pay $10', p: 'Add your details and pay by card or PayPal, the way you would in any online shop.', tag: '$10' },
  { t: 'Upload your two pages', p: 'Send the two pages. That is the whole entry. The rest of your script stays with you.', tag: 'Two pages' },
  { t: 'Our readers read every entry', p: 'A team of part-time readers goes through each entry: movie buffs, actors in the making and writers who know the struggle.', tag: 'Every entry read' },
  { t: 'Winners are announced', p: 'In film publications, on movie sites and right here on this website. Winners are contacted by email.', tag: 'Worldwide' },
  { t: 'Then we do it again', p: 'The contest runs twice a year, so there is always another chance, with prizes that grow as more writers join.', tag: 'Twice a year' }
];

AD.faq = [
  ['How much does it cost to enter?', 'Ten dollars. Normal screenplay contests charge from $45 for an early bird to $95 or more for a late entry. We know many writers count every penny, so we made a contest everyone can afford.'],
  ['What do I send?', 'Only your first full page and your last full page. The beginning creates fantasies and curiosity, and the end surprises the viewer or leaves an everlasting memory, so those are the two pages we read.'],
  ['Which genres can I enter?', 'Any genre. We welcome scripts of every kind.'],
  ['Who can enter?', 'Seasoned and beginner screenwriters from all over the world.'],
  ['When is the deadline?', 'The first deadline is Feb 28, 2027. The contest is a semi-annual event, so it runs twice a year.'],
  ['How do I pay?', 'By card or PayPal when you enter, the same way you would pay on any online shop.'],
  ['How are the prizes decided?', 'The prize amount depends on participation. The more entries we receive, the more writers we can recognize and the higher the prizes get. There are also draws among all contestants.'],
  ['Where does the charity money go?', '5% of our income goes to charity. [Charity name] will be announced before the contest opens.'],
  ['Who reads my pages?', 'A team of part-time readers: movie buffs, actors in the making and writers who know the struggle. Want to join them? See the Readers page.'],
  ['When and how are winners announced?', 'Winners are announced in film publications, on movie sites and on this website. Winners are also contacted by email.']
];

AD.genres = ['Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-fi', 'Fantasy', 'Romance', 'Action', 'Animation', 'Documentary', 'Other'];
