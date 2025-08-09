// utils/vcard.js
export function generateVCard(fullName, designation, contact = {}, socials = {}) {
  let vcf = `BEGIN:VCARD
VERSION:3.0
FN:${fullName || ''}
TITLE:${designation || ''}
`;

  // Contact details
  if (contact.phone) vcf += `TEL;TYPE=cell:${contact.phone}\n`;
  if (contact.email) vcf += `EMAIL;TYPE=internet:${contact.email}\n`;
  if (contact.whatsapp) {
    vcf += `item1.URL:https://wa.me/${contact.whatsapp.replace(/\D/g, '')}\n`;
    vcf += `item1.X-ABLabel:WhatsApp\n`;
  }

  // Social links with labels
  const labelMap = {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    twitter: 'Twitter',
    website: 'Website',
    youtube: 'YouTube',
    spotify: 'Spotify',
    telegram: 'Telegram',
    pinterest: 'Pinterest',
    threads: 'Threads',
    behance: 'Behance',
    github: 'GitHub',
    tiktok: 'TikTok',
    c_link1: 'Custom Link 1',
    c_link2: 'Custom Link 2'
  };

  const linkMap = {
    whatsapp: (val) => `https://wa.me/${val.replace(/\D/g, '')}`,
    instagram: (val) => `https://instagram.com/${val}`,
    linkedin: (val) => `https://linkedin.com/in/${val}`,
    facebook: (val) => `https://facebook.com/${val}`,
    twitter: (val) => `https://twitter.com/${val}`,
    website: (val) => (val.startsWith('http') ? val : `https://${val}`),
    youtube: (val) => `https://youtube.com/${val}`,
    spotify: (val) => `https://open.spotify.com/user/${val}`,
    telegram: (val) => `https://t.me/${val}`,
    pinterest: (val) => `https://pinterest.com/${val}`,
    threads: (val) => `https://threads.net/@${val}`,
    behance: (val) => `https://behance.net/${val}`,
    github: (val) => `https://github.com/${val}`,
    tiktok: (val) => `https://tiktok.com/@${val}`,
    c_link1: (val) => (val.startsWith('http') ? val : `https://${val}`),
    c_link2: (val) => (val.startsWith('http') ? val : `https://${val}`)
  };

  let counter = 2; // start after WhatsApp
  Object.entries(socials).forEach(([key, value]) => {
    if (value && linkMap[key]) {
      const url = linkMap[key](value);
      const label = labelMap[key] || key;
      vcf += `item${counter}.URL:${url}\n`;
      vcf += `item${counter}.X-ABLabel:${label}\n`;
      counter++;
    }
  });

  vcf += `END:VCARD`;
  return vcf;
}
