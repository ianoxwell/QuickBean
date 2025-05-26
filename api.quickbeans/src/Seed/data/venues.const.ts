import { Venue } from '@controllers/venue/Venue.entity';

const venues: Partial<Venue>[] = [
  {
    name: 'Downtown Coffee Bar',
    websiteUrl: 'https://downtowncoffee.example.com',
    slug: 'downtown-coffee-bar',
    logoImage: 'https://downtowncoffee.example.com/logo.png',
    isActive: true,
    countryId: 'AU',
    openingHours: [
      { day: 0, open: 500, close: 1300 },
      { day: 1, open: 600, close: 1400 },
      { day: 2, open: 600, close: 1400 },
      { day: 3, open: 600, close: 1400 },
      { day: 4, open: 600, close: 1400 },
      { day: 5, open: 600, close: 2100 },
      { day: 6, open: 500, close: 1300 }
    ],
    address: '123 Queen St',
    city: 'Brisbane',
    state: 'QLD',
    postcode: '4000',
    publicPhone: '+61 7 1234 5678',
    legalBusinessName: 'Downtown Coffee Pty Ltd',
    legalBusinessNumber: 'ABN123456789',
    timezone: 'Australia/Brisbane',
    privacyPolicy: 'https://downtowncoffee.example.com/privacy'
  }
];

export default venues;
