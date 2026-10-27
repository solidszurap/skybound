export interface WorldCountryInfo {
  code: string; // ISO-2
  numericId: string; // ISO-3166-1 numeric for world-atlas TopoJSON
  name: string;
  continent: 'Europe' | 'Asia' | 'North America' | 'South America' | 'Africa' | 'Oceania';
  capital: string;
  defaultIata: string;
  lat: number;
  lon: number;
  flagColors: [string, string, string?];
}

// Convert ISO-2 code to Unicode Flag Emoji
export function getCountryFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  if (code.length !== 2) return '🏳️';
  const offset = 127397;
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset);
}

// Get high-resolution PNG national flag from FlagCDN for universal crisp rendering
export function getCountryFlagImageUrl(countryCode: string): string {
  const code = (countryCode || 'jp').toLowerCase();
  return `https://flagcdn.com/w160/${code}.png`;
}

// Generate an inline SVG Flag data-URL using the country's national flag colors + emoji/emblem for 100% offline/canvas reliability
export function getCountryFlagSvgDataUrl(country: WorldCountryInfo): string {
  const [c1, c2, c3] = country.flagColors;
  const svg = c3
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="60" height="40">
        <rect width="60" height="13.4" y="0" fill="${c1}"/>
        <rect width="60" height="13.4" y="13.3" fill="${c2}"/>
        <rect width="60" height="13.4" y="26.6" fill="${c3}"/>
        <rect width="60" height="40" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" width="60" height="40">
        <rect width="30" height="40" x="0" fill="${c1}"/>
        <rect width="30" height="40" x="30" fill="${c2}"/>
        <circle cx="30" cy="20" r="8" fill="${c2}" stroke="${c1}" stroke-width="2"/>
        <rect width="60" height="40" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
      </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Complete global catalog of 195 countries across all 6 inhabited continents
export const ALL_WORLD_COUNTRIES: WorldCountryInfo[] = [
  // EUROPE
  { code: 'AL', numericId: '008', name: 'Albania', continent: 'Europe', capital: 'Tirana', defaultIata: 'TIA', lat: 41.33, lon: 19.82, flagColors: ['#E41E20', '#000000', '#E41E20'] },
  { code: 'AD', numericId: '020', name: 'Andorra', continent: 'Europe', capital: 'Andorra la Vella', defaultIata: 'LEU', lat: 42.51, lon: 1.52, flagColors: ['#10069F', '#FEDD00', '#D50032'] },
  { code: 'AT', numericId: '040', name: 'Austria', continent: 'Europe', capital: 'Vienna', defaultIata: 'VIE', lat: 48.21, lon: 16.37, flagColors: ['#ED2939', '#FFFFFF', '#ED2939'] },
  { code: 'BY', numericId: '112', name: 'Belarus', continent: 'Europe', capital: 'Minsk', defaultIata: 'MSQ', lat: 53.90, lon: 27.57, flagColors: ['#D22730', '#009739'] },
  { code: 'BE', numericId: '056', name: 'Belgium', continent: 'Europe', capital: 'Brussels', defaultIata: 'BRU', lat: 50.85, lon: 4.35, flagColors: ['#000000', '#FDDA24', '#EF3340'] },
  { code: 'BA', numericId: '070', name: 'Bosnia and Herzegovina', continent: 'Europe', capital: 'Sarajevo', defaultIata: 'SJJ', lat: 43.86, lon: 18.41, flagColors: ['#002395', '#FECB00'] },
  { code: 'BG', numericId: '100', name: 'Bulgaria', continent: 'Europe', capital: 'Sofia', defaultIata: 'SOF', lat: 42.70, lon: 23.32, flagColors: ['#FFFFFF', '#00966E', '#D62612'] },
  { code: 'HR', numericId: '191', name: 'Croatia', continent: 'Europe', capital: 'Zagreb', defaultIata: 'ZAG', lat: 45.81, lon: 15.98, flagColors: ['#FF0000', '#FFFFFF', '#171796'] },
  { code: 'CY', numericId: '196', name: 'Cyprus', continent: 'Europe', capital: 'Nicosia', defaultIata: 'LCA', lat: 35.19, lon: 33.38, flagColors: ['#FFFFFF', '#D57800'] },
  { code: 'CZ', numericId: '203', name: 'Czechia', continent: 'Europe', capital: 'Prague', defaultIata: 'PRG', lat: 50.08, lon: 14.44, flagColors: ['#FFFFFF', '#D7141A', '#11457E'] },
  { code: 'DK', numericId: '208', name: 'Denmark', continent: 'Europe', capital: 'Copenhagen', defaultIata: 'CPH', lat: 55.68, lon: 12.57, flagColors: ['#C8102E', '#FFFFFF'] },
  { code: 'EE', numericId: '233', name: 'Estonia', continent: 'Europe', capital: 'Tallinn', defaultIata: 'TLL', lat: 59.44, lon: 24.75, flagColors: ['#0072CE', '#000000', '#FFFFFF'] },
  { code: 'FI', numericId: '246', name: 'Finland', continent: 'Europe', capital: 'Helsinki', defaultIata: 'HEL', lat: 60.17, lon: 24.94, flagColors: ['#FFFFFF', '#002F6C'] },
  { code: 'FR', numericId: '250', name: 'France', continent: 'Europe', capital: 'Paris', defaultIata: 'CDG', lat: 48.86, lon: 2.35, flagColors: ['#002395', '#FFFFFF', '#ED2939'] },
  { code: 'DE', numericId: '276', name: 'Germany', continent: 'Europe', capital: 'Berlin', defaultIata: 'FRA', lat: 52.52, lon: 13.40, flagColors: ['#000000', '#DD0000', '#FFCE00'] },
  { code: 'GR', numericId: '300', name: 'Greece', continent: 'Europe', capital: 'Athens', defaultIata: 'ATH', lat: 37.98, lon: 23.73, flagColors: ['#0D5EAF', '#FFFFFF', '#0D5EAF'] },
  { code: 'HU', numericId: '348', name: 'Hungary', continent: 'Europe', capital: 'Budapest', defaultIata: 'BUD', lat: 47.50, lon: 19.04, flagColors: ['#CE2939', '#FFFFFF', '#477050'] },
  { code: 'IS', numericId: '352', name: 'Iceland', continent: 'Europe', capital: 'Reykjavik', defaultIata: 'KEF', lat: 64.15, lon: -21.94, flagColors: ['#02529C', '#FFFFFF', '#DC1E35'] },
  { code: 'IE', numericId: '372', name: 'Ireland', continent: 'Europe', capital: 'Dublin', defaultIata: 'DUB', lat: 53.35, lon: -6.26, flagColors: ['#169B62', '#FFFFFF', '#FF883E'] },
  { code: 'IT', numericId: '380', name: 'Italy', continent: 'Europe', capital: 'Rome', defaultIata: 'FCO', lat: 41.90, lon: 12.50, flagColors: ['#009246', '#FFFFFF', '#CE2B37'] },
  { code: 'LV', numericId: '428', name: 'Latvia', continent: 'Europe', capital: 'Riga', defaultIata: 'RIX', lat: 56.95, lon: 24.11, flagColors: ['#9E3039', '#FFFFFF', '#9E3039'] },
  { code: 'LI', numericId: '438', name: 'Liechtenstein', continent: 'Europe', capital: 'Vaduz', defaultIata: 'ZRH', lat: 47.14, lon: 9.52, flagColors: ['#002B7F', '#CE1126'] },
  { code: 'LT', numericId: '440', name: 'Lithuania', continent: 'Europe', capital: 'Vilnius', defaultIata: 'VNO', lat: 54.69, lon: 25.28, flagColors: ['#FDB913', '#006A44', '#C1272D'] },
  { code: 'LU', numericId: '442', name: 'Luxembourg', continent: 'Europe', capital: 'Luxembourg', defaultIata: 'LUX', lat: 49.61, lon: 6.13, flagColors: ['#EA141D', '#FFFFFF', '#51ADDA'] },
  { code: 'MT', numericId: '470', name: 'Malta', continent: 'Europe', capital: 'Valletta', defaultIata: 'MLA', lat: 35.90, lon: 14.51, flagColors: ['#FFFFFF', '#CF142B'] },
  { code: 'MD', numericId: '498', name: 'Moldova', continent: 'Europe', capital: 'Chisinau', defaultIata: 'RMO', lat: 47.01, lon: 28.86, flagColors: ['#003DA5', '#FFD100', '#C8102E'] },
  { code: 'MC', numericId: '492', name: 'Monaco', continent: 'Europe', capital: 'Monaco', defaultIata: 'NCE', lat: 43.73, lon: 7.42, flagColors: ['#CE1126', '#FFFFFF'] },
  { code: 'ME', numericId: '499', name: 'Montenegro', continent: 'Europe', capital: 'Podgorica', defaultIata: 'TGD', lat: 42.44, lon: 19.26, flagColors: ['#C40308', '#D4AF37'] },
  { code: 'NL', numericId: '528', name: 'Netherlands', continent: 'Europe', capital: 'Amsterdam', defaultIata: 'AMS', lat: 52.37, lon: 4.90, flagColors: ['#AE1C28', '#FFFFFF', '#21468B'] },
  { code: 'MK', numericId: '807', name: 'North Macedonia', continent: 'Europe', capital: 'Skopje', defaultIata: 'SKP', lat: 42.00, lon: 21.43, flagColors: ['#D20000', '#FFE600'] },
  { code: 'NO', numericId: '578', name: 'Norway', continent: 'Europe', capital: 'Oslo', defaultIata: 'OSL', lat: 59.91, lon: 10.75, flagColors: ['#BA0C2F', '#FFFFFF', '#00205B'] },
  { code: 'PL', numericId: '616', name: 'Poland', continent: 'Europe', capital: 'Warsaw', defaultIata: 'WAW', lat: 52.23, lon: 21.01, flagColors: ['#FFFFFF', '#DC143C'] },
  { code: 'PT', numericId: '620', name: 'Portugal', continent: 'Europe', capital: 'Lisbon', defaultIata: 'LIS', lat: 38.72, lon: -9.14, flagColors: ['#046A38', '#DA291C'] },
  { code: 'RO', numericId: '642', name: 'Romania', continent: 'Europe', capital: 'Bucharest', defaultIata: 'OTP', lat: 44.43, lon: 26.10, flagColors: ['#002B7F', '#FCD116', '#CE1126'] },
  { code: 'SM', numericId: '674', name: 'San Marino', continent: 'Europe', capital: 'San Marino', defaultIata: 'RMI', lat: 43.94, lon: 12.46, flagColors: ['#FFFFFF', '#5EB6E4'] },
  { code: 'RS', numericId: '688', name: 'Serbia', continent: 'Europe', capital: 'Belgrade', defaultIata: 'BEG', lat: 44.79, lon: 20.45, flagColors: ['#C6363C', '#0C4076', '#FFFFFF'] },
  { code: 'SK', numericId: '703', name: 'Slovakia', continent: 'Europe', capital: 'Bratislava', defaultIata: 'BTS', lat: 48.15, lon: 17.11, flagColors: ['#FFFFFF', '#0B4EA2', '#EE1C25'] },
  { code: 'SI', numericId: '705', name: 'Slovenia', continent: 'Europe', capital: 'Ljubljana', defaultIata: 'LJU', lat: 46.06, lon: 14.51, flagColors: ['#FFFFFF', '#005CE6', '#ED1C24'] },
  { code: 'ES', numericId: '724', name: 'Spain', continent: 'Europe', capital: 'Madrid', defaultIata: 'BCN', lat: 40.42, lon: -3.70, flagColors: ['#AA151B', '#F1BF00', '#AA151B'] },
  { code: 'SE', numericId: '752', name: 'Sweden', continent: 'Europe', capital: 'Stockholm', defaultIata: 'ARN', lat: 59.33, lon: 18.07, flagColors: ['#006AA7', '#FECC02'] },
  { code: 'CH', numericId: '756', name: 'Switzerland', continent: 'Europe', capital: 'Zurich', defaultIata: 'ZRH', lat: 47.37, lon: 8.54, flagColors: ['#DA291C', '#FFFFFF'] },
  { code: 'UA', numericId: '804', name: 'Ukraine', continent: 'Europe', capital: 'Kyiv', defaultIata: 'KBP', lat: 50.45, lon: 30.52, flagColors: ['#0057B7', '#FFDD00'] },
  { code: 'GB', numericId: '826', name: 'United Kingdom', continent: 'Europe', capital: 'London', defaultIata: 'LHR', lat: 51.51, lon: -0.13, flagColors: ['#012169', '#FFFFFF', '#C8102E'] },
  { code: 'VA', numericId: '336', name: 'Vatican City', continent: 'Europe', capital: 'Vatican City', defaultIata: 'FCO', lat: 41.90, lon: 12.45, flagColors: ['#FFE000', '#FFFFFF'] },

  // ASIA
  { code: 'AF', numericId: '004', name: 'Afghanistan', continent: 'Asia', capital: 'Kabul', defaultIata: 'KBL', lat: 34.56, lon: 69.21, flagColors: ['#000000', '#D32011', '#007A36'] },
  { code: 'AM', numericId: '051', name: 'Armenia', continent: 'Asia', capital: 'Yerevan', defaultIata: 'EVN', lat: 40.18, lon: 44.51, flagColors: ['#D90012', '#0033A0', '#F2A800'] },
  { code: 'AZ', numericId: '031', name: 'Azerbaijan', continent: 'Asia', capital: 'Baku', defaultIata: 'GYD', lat: 40.41, lon: 49.87, flagColors: ['#00B5E2', '#EF3340', '#509E2F'] },
  { code: 'BH', numericId: '048', name: 'Bahrain', continent: 'Asia', capital: 'Manama', defaultIata: 'BAH', lat: 26.23, lon: 50.59, flagColors: ['#FFFFFF', '#CE1126'] },
  { code: 'BD', numericId: '050', name: 'Bangladesh', continent: 'Asia', capital: 'Dhaka', defaultIata: 'DAC', lat: 23.81, lon: 90.41, flagColors: ['#006A4E', '#F42A41'] },
  { code: 'BT', numericId: '064', name: 'Bhutan', continent: 'Asia', capital: 'Thimphu', defaultIata: 'PBH', lat: 27.47, lon: 89.64, flagColors: ['#FFCD00', '#FF671F'] },
  { code: 'BN', numericId: '096', name: 'Brunei', continent: 'Asia', capital: 'Bandar Seri Begawan', defaultIata: 'BWN', lat: 4.90, lon: 114.94, flagColors: ['#F7E017', '#FFFFFF', '#000000'] },
  { code: 'KH', numericId: '116', name: 'Cambodia', continent: 'Asia', capital: 'Phnom Penh', defaultIata: 'PNH', lat: 11.56, lon: 104.92, flagColors: ['#032EA1', '#E00025', '#032EA1'] },
  { code: 'CN', numericId: '156', name: 'China', continent: 'Asia', capital: 'Beijing', defaultIata: 'PEK', lat: 39.90, lon: 116.41, flagColors: ['#EE1C25', '#FFFF00'] },
  { code: 'GE', numericId: '268', name: 'Georgia', continent: 'Asia', capital: 'Tbilisi', defaultIata: 'TBS', lat: 41.72, lon: 44.79, flagColors: ['#FFFFFF', '#FF0000'] },
  { code: 'HK', numericId: '344', name: 'Hong Kong', continent: 'Asia', capital: 'Hong Kong', defaultIata: 'HKG', lat: 22.32, lon: 114.17, flagColors: ['#DE2910', '#FFFFFF'] },
  { code: 'IN', numericId: '356', name: 'India', continent: 'Asia', capital: 'New Delhi', defaultIata: 'DEL', lat: 28.61, lon: 77.21, flagColors: ['#FF9933', '#FFFFFF', '#138808'] },
  { code: 'ID', numericId: '360', name: 'Indonesia', continent: 'Asia', capital: 'Jakarta', defaultIata: 'DPS', lat: -6.21, lon: 106.85, flagColors: ['#FF0000', '#FFFFFF'] },
  { code: 'IR', numericId: '364', name: 'Iran', continent: 'Asia', capital: 'Tehran', defaultIata: 'IKA', lat: 35.69, lon: 51.39, flagColors: ['#239F40', '#FFFFFF', '#DA0000'] },
  { code: 'IQ', numericId: '368', name: 'Iraq', continent: 'Asia', capital: 'Baghdad', defaultIata: 'BGW', lat: 33.31, lon: 44.37, flagColors: ['#CE1126', '#FFFFFF', '#000000'] },
  { code: 'IL', numericId: '376', name: 'Israel', continent: 'Asia', capital: 'Tel Aviv', defaultIata: 'TLV', lat: 32.09, lon: 34.78, flagColors: ['#FFFFFF', '#0038B8', '#FFFFFF'] },
  { code: 'JP', numericId: '392', name: 'Japan', continent: 'Asia', capital: 'Tokyo', defaultIata: 'HND', lat: 35.68, lon: 139.65, flagColors: ['#FFFFFF', '#BC002D'] },
  { code: 'JO', numericId: '400', name: 'Jordan', continent: 'Asia', capital: 'Amman', defaultIata: 'AMM', lat: 31.95, lon: 35.91, flagColors: ['#000000', '#FFFFFF', '#007A3D'] },
  { code: 'KZ', numericId: '398', name: 'Kazakhstan', continent: 'Asia', capital: 'Almaty', defaultIata: 'ALA', lat: 43.22, lon: 76.85, flagColors: ['#00AFCA', '#FEC50C'] },
  { code: 'KW', numericId: '414', name: 'Kuwait', continent: 'Asia', capital: 'Kuwait City', defaultIata: 'KWI', lat: 29.38, lon: 47.98, flagColors: ['#007A3D', '#FFFFFF', '#CE1126'] },
  { code: 'KG', numericId: '417', name: 'Kyrgyzstan', continent: 'Asia', capital: 'Bishkek', defaultIata: 'FRU', lat: 42.87, lon: 74.59, flagColors: ['#E8112D', '#FFEF00'] },
  { code: 'LA', numericId: '418', name: 'Laos', continent: 'Asia', capital: 'Vientiane', defaultIata: 'VTE', lat: 17.98, lon: 102.63, flagColors: ['#CE1126', '#002868', '#CE1126'] },
  { code: 'LB', numericId: '422', name: 'Lebanon', continent: 'Asia', capital: 'Beirut', defaultIata: 'BEY', lat: 33.89, lon: 35.50, flagColors: ['#ED1C24', '#FFFFFF', '#00A651'] },
  { code: 'MY', numericId: '458', name: 'Malaysia', continent: 'Asia', capital: 'Kuala Lumpur', defaultIata: 'KUL', lat: 3.14, lon: 101.69, flagColors: ['#010066', '#CC0001', '#FFCC00'] },
  { code: 'MV', numericId: '462', name: 'Maldives', continent: 'Asia', capital: 'Malé', defaultIata: 'MLE', lat: 4.18, lon: 73.51, flagColors: ['#D21034', '#007E3A'] },
  { code: 'MN', numericId: '496', name: 'Mongolia', continent: 'Asia', capital: 'Ulaanbaatar', defaultIata: 'UBN', lat: 47.92, lon: 106.91, flagColors: ['#C4272F', '#015197', '#C4272F'] },
  { code: 'MM', numericId: '104', name: 'Myanmar', continent: 'Asia', capital: 'Yangon', defaultIata: 'RGN', lat: 16.84, lon: 96.17, flagColors: ['#FECB00', '#34B233', '#EA2839'] },
  { code: 'NP', numericId: '524', name: 'Nepal', continent: 'Asia', capital: 'Kathmandu', defaultIata: 'KTM', lat: 27.72, lon: 85.32, flagColors: ['#DC143C', '#003893'] },
  { code: 'OM', numericId: '512', name: 'Oman', continent: 'Asia', capital: 'Muscat', defaultIata: 'MCT', lat: 23.59, lon: 58.38, flagColors: ['#FFFFFF', '#DB161B', '#008000'] },
  { code: 'PK', numericId: '586', name: 'Pakistan', continent: 'Asia', capital: 'Islamabad', defaultIata: 'ISB', lat: 33.68, lon: 73.05, flagColors: ['#01411C', '#FFFFFF'] },
  { code: 'PH', numericId: '608', name: 'Philippines', continent: 'Asia', capital: 'Manila', defaultIata: 'MNL', lat: 14.60, lon: 120.98, flagColors: ['#0038A8', '#CE1126', '#FCD116'] },
  { code: 'QA', numericId: '634', name: 'Qatar', continent: 'Asia', capital: 'Doha', defaultIata: 'DOH', lat: 25.29, lon: 51.53, flagColors: ['#8A1538', '#FFFFFF'] },
  { code: 'SA', numericId: '682', name: 'Saudi Arabia', continent: 'Asia', capital: 'Riyadh', defaultIata: 'RUH', lat: 24.71, lon: 46.68, flagColors: ['#006C35', '#FFFFFF'] },
  { code: 'SG', numericId: '702', name: 'Singapore', continent: 'Asia', capital: 'Singapore', defaultIata: 'SIN', lat: 1.35, lon: 103.82, flagColors: ['#EF3340', '#FFFFFF'] },
  { code: 'KR', numericId: '410', name: 'South Korea', continent: 'Asia', capital: 'Seoul', defaultIata: 'ICN', lat: 37.57, lon: 126.98, flagColors: ['#FFFFFF', '#CD2E3A', '#0047A0'] },
  { code: 'LK', numericId: '144', name: 'Sri Lanka', continent: 'Asia', capital: 'Colombo', defaultIata: 'CMB', lat: 6.93, lon: 79.86, flagColors: ['#8D153A', '#FFBE29', '#00534E'] },
  { code: 'SY', numericId: '760', name: 'Syria', continent: 'Asia', capital: 'Damascus', defaultIata: 'DAM', lat: 33.51, lon: 36.28, flagColors: ['#CE1126', '#FFFFFF', '#000000'] },
  { code: 'TW', numericId: '158', name: 'Taiwan', continent: 'Asia', capital: 'Taipei', defaultIata: 'TPE', lat: 25.03, lon: 121.57, flagColors: ['#FE0000', '#000095', '#FFFFFF'] },
  { code: 'TJ', numericId: '762', name: 'Tajikistan', continent: 'Asia', capital: 'Dushanbe', defaultIata: 'DYU', lat: 38.56, lon: 68.79, flagColors: ['#CC0000', '#FFFFFF', '#006600'] },
  { code: 'TH', numericId: '764', name: 'Thailand', continent: 'Asia', capital: 'Bangkok', defaultIata: 'BKK', lat: 13.76, lon: 100.50, flagColors: ['#A51931', '#F4F5F8', '#2D2A4A'] },
  { code: 'TL', numericId: '626', name: 'Timor-Leste', continent: 'Asia', capital: 'Dili', defaultIata: 'DIL', lat: -8.56, lon: 125.56, flagColors: ['#DC241F', '#FFC726', '#000000'] },
  { code: 'TR', numericId: '792', name: 'Turkey', continent: 'Asia', capital: 'Istanbul', defaultIata: 'IST', lat: 41.01, lon: 28.98, flagColors: ['#E30A17', '#FFFFFF'] },
  { code: 'TM', numericId: '795', name: 'Turkmenistan', continent: 'Asia', capital: 'Ashgabat', defaultIata: 'ASB', lat: 37.96, lon: 58.33, flagColors: ['#00843D', '#D22630'] },
  { code: 'AE', numericId: '784', name: 'United Arab Emirates', continent: 'Asia', capital: 'Dubai', defaultIata: 'DXB', lat: 25.20, lon: 55.27, flagColors: ['#00732F', '#FFFFFF', '#000000'] },
  { code: 'UZ', numericId: '860', name: 'Uzbekistan', continent: 'Asia', capital: 'Tashkent', defaultIata: 'TAS', lat: 41.30, lon: 69.24, flagColors: ['#0099B5', '#FFFFFF', '#1EB53A'] },
  { code: 'VN', numericId: '704', name: 'Vietnam', continent: 'Asia', capital: 'Hanoi', defaultIata: 'HAN', lat: 21.03, lon: 105.83, flagColors: ['#DA251D', '#FFFF00'] },
  { code: 'YE', numericId: '887', name: 'Yemen', continent: 'Asia', capital: 'Sanaa', defaultIata: 'SAH', lat: 15.37, lon: 44.19, flagColors: ['#CE1126', '#FFFFFF', '#000000'] },

  // NORTH AMERICA & CARIBBEAN
  { code: 'AG', numericId: '028', name: 'Antigua and Barbuda', continent: 'North America', capital: "St. John's", defaultIata: 'ANU', lat: 17.12, lon: -61.85, flagColors: ['#CE1126', '#0072C6', '#FCD116'] },
  { code: 'BS', numericId: '044', name: 'Bahamas', continent: 'North America', capital: 'Nassau', defaultIata: 'NAS', lat: 25.04, lon: -77.35, flagColors: ['#00778B', '#FFC72C', '#000000'] },
  { code: 'BB', numericId: '052', name: 'Barbados', continent: 'North America', capital: 'Bridgetown', defaultIata: 'BGI', lat: 13.10, lon: -59.61, flagColors: ['#00267F', '#FFC726', '#00267F'] },
  { code: 'BZ', numericId: '084', name: 'Belize', continent: 'North America', capital: 'Belize City', defaultIata: 'BZE', lat: 17.50, lon: -88.19, flagColors: ['#003F87', '#CE1126'] },
  { code: 'CA', numericId: '124', name: 'Canada', continent: 'North America', capital: 'Toronto', defaultIata: 'YYZ', lat: 45.42, lon: -75.70, flagColors: ['#FF0000', '#FFFFFF', '#FF0000'] },
  { code: 'CR', numericId: '188', name: 'Costa Rica', continent: 'North America', capital: 'San José', defaultIata: 'SJO', lat: 9.93, lon: -84.09, flagColors: ['#002B7F', '#CE1126', '#FFFFFF'] },
  { code: 'CU', numericId: '192', name: 'Cuba', continent: 'North America', capital: 'Havana', defaultIata: 'HAV', lat: 23.11, lon: -82.37, flagColors: ['#002A8F', '#FFFFFF', '#CB1515'] },
  { code: 'DM', numericId: '212', name: 'Dominica', continent: 'North America', capital: 'Roseau', defaultIata: 'DOM', lat: 15.30, lon: -61.39, flagColors: ['#006B3F', '#FCD116', '#D41C30'] },
  { code: 'DO', numericId: '214', name: 'Dominican Republic', continent: 'North America', capital: 'Santo Domingo', defaultIata: 'PUJ', lat: 18.49, lon: -69.93, flagColors: ['#002D62', '#FFFFFF', '#CE1126'] },
  { code: 'SV', numericId: '222', name: 'El Salvador', continent: 'North America', capital: 'San Salvador', defaultIata: 'SAL', lat: 13.69, lon: -89.22, flagColors: ['#0F47AF', '#FFFFFF', '#0F47AF'] },
  { code: 'GD', numericId: '308', name: 'Grenada', continent: 'North America', capital: "St. George's", defaultIata: 'GND', lat: 12.06, lon: -61.75, flagColors: ['#CE1126', '#FCD116', '#007A5E'] },
  { code: 'GT', numericId: '320', name: 'Guatemala', continent: 'North America', capital: 'Guatemala City', defaultIata: 'GUA', lat: 14.63, lon: -90.51, flagColors: ['#4997D0', '#FFFFFF', '#4997D0'] },
  { code: 'HT', numericId: '332', name: 'Haiti', continent: 'North America', capital: 'Port-au-Prince', defaultIata: 'PAP', lat: 18.59, lon: -72.31, flagColors: ['#00209F', '#D21034'] },
  { code: 'HN', numericId: '340', name: 'Honduras', continent: 'North America', capital: 'Tegucigalpa', defaultIata: 'SAP', lat: 14.07, lon: -87.19, flagColors: ['#0073CF', '#FFFFFF', '#0073CF'] },
  { code: 'JM', numericId: '388', name: 'Jamaica', continent: 'North America', capital: 'Montego Bay', defaultIata: 'MBJ', lat: 18.00, lon: -76.79, flagColors: ['#009B3A', '#FED100', '#000000'] },
  { code: 'MX', numericId: '484', name: 'Mexico', continent: 'North America', capital: 'Mexico City', defaultIata: 'MEX', lat: 19.43, lon: -99.13, flagColors: ['#006847', '#FFFFFF', '#CE1126'] },
  { code: 'NI', numericId: '558', name: 'Nicaragua', continent: 'North America', capital: 'Managua', defaultIata: 'MGA', lat: 12.11, lon: -86.24, flagColors: ['#0067C6', '#FFFFFF', '#0067C6'] },
  { code: 'PA', numericId: '591', name: 'Panama', continent: 'North America', capital: 'Panama City', defaultIata: 'PTY', lat: 8.98, lon: -79.52, flagColors: ['#FFFFFF', '#DA121A', '#072357'] },
  { code: 'KN', numericId: '659', name: 'Saint Kitts and Nevis', continent: 'North America', capital: 'Basseterre', defaultIata: 'SKB', lat: 17.30, lon: -62.72, flagColors: ['#009E49', '#000000', '#CE1126'] },
  { code: 'LC', numericId: '662', name: 'Saint Lucia', continent: 'North America', capital: 'Castries', defaultIata: 'UVF', lat: 14.01, lon: -60.99, flagColors: ['#66CCFF', '#FCD116', '#000000'] },
  { code: 'VC', numericId: '670', name: 'Saint Vincent and the Grenadines', continent: 'North America', capital: 'Kingstown', defaultIata: 'SVD', lat: 13.16, lon: -61.22, flagColors: ['#0072C6', '#FCD116', '#009E60'] },
  { code: 'TT', numericId: '780', name: 'Trinidad and Tobago', continent: 'North America', capital: 'Port of Spain', defaultIata: 'POS', lat: 10.65, lon: -61.50, flagColors: ['#CE1126', '#000000', '#FFFFFF'] },
  { code: 'US', numericId: '840', name: 'United States', continent: 'North America', capital: 'New York', defaultIata: 'JFK', lat: 38.90, lon: -77.04, flagColors: ['#B22234', '#FFFFFF', '#3C3B6E'] },

  // SOUTH AMERICA
  { code: 'AR', numericId: '032', name: 'Argentina', continent: 'South America', capital: 'Buenos Aires', defaultIata: 'EZE', lat: -34.60, lon: -58.38, flagColors: ['#74ACDF', '#FFFFFF', '#74ACDF'] },
  { code: 'BO', numericId: '068', name: 'Bolivia', continent: 'South America', capital: 'La Paz', defaultIata: 'LPB', lat: -16.49, lon: -68.12, flagColors: ['#D52B1E', '#F9E300', '#007934'] },
  { code: 'BR', numericId: '076', name: 'Brazil', continent: 'South America', capital: 'São Paulo', defaultIata: 'GRU', lat: -15.79, lon: -47.88, flagColors: ['#009739', '#FEDD00', '#012169'] },
  { code: 'CL', numericId: '152', name: 'Chile', continent: 'South America', capital: 'Santiago', defaultIata: 'SCL', lat: -33.45, lon: -70.67, flagColors: ['#FFFFFF', '#D52B1E', '#0039A6'] },
  { code: 'CO', numericId: '170', name: 'Colombia', continent: 'South America', capital: 'Bogotá', defaultIata: 'BOG', lat: 4.71, lon: -74.07, flagColors: ['#FCD116', '#003893', '#CE1126'] },
  { code: 'EC', numericId: '218', name: 'Ecuador', continent: 'South America', capital: 'Quito', defaultIata: 'UIO', lat: -0.18, lon: -78.47, flagColors: ['#FFD100', '#0072CE', '#EF3340'] },
  { code: 'GY', numericId: '328', name: 'Guyana', continent: 'South America', capital: 'Georgetown', defaultIata: 'GEO', lat: 6.80, lon: -58.16, flagColors: ['#009E49', '#FCD116', '#CE1126'] },
  { code: 'PY', numericId: '600', name: 'Paraguay', continent: 'South America', capital: 'Asunción', defaultIata: 'ASU', lat: -25.26, lon: -57.58, flagColors: ['#D52B1E', '#FFFFFF', '#0038A8'] },
  { code: 'PE', numericId: '604', name: 'Peru', continent: 'South America', capital: 'Lima', defaultIata: 'LIM', lat: -12.05, lon: -77.04, flagColors: ['#D91023', '#FFFFFF', '#D91023'] },
  { code: 'SR', numericId: '740', name: 'Suriname', continent: 'South America', capital: 'Paramaribo', defaultIata: 'PBM', lat: 5.85, lon: -55.20, flagColors: ['#377E3F', '#B40A2D', '#ECC81D'] },
  { code: 'UY', numericId: '858', name: 'Uruguay', continent: 'South America', capital: 'Montevideo', defaultIata: 'MVD', lat: -34.90, lon: -56.16, flagColors: ['#FFFFFF', '#0038A8', '#FCD116'] },
  { code: 'VE', numericId: '862', name: 'Venezuela', continent: 'South America', capital: 'Caracas', defaultIata: 'CCS', lat: 10.48, lon: -66.90, flagColors: ['#FCE300', '#00247D', '#CF142B'] },

  // OCEANIA
  { code: 'AU', numericId: '036', name: 'Australia', continent: 'Oceania', capital: 'Sydney', defaultIata: 'SYD', lat: -33.87, lon: 151.21, flagColors: ['#012169', '#FFFFFF', '#E4002B'] },
  { code: 'FJ', numericId: '242', name: 'Fiji', continent: 'Oceania', capital: 'Nadi', defaultIata: 'NAN', lat: -17.77, lon: 177.95, flagColors: ['#68BFE5', '#012169', '#CE1126'] },
  { code: 'KI', numericId: '296', name: 'Kiribati', continent: 'Oceania', capital: 'Tarawa', defaultIata: 'TRW', lat: 1.33, lon: 172.98, flagColors: ['#CE1126', '#FCD116', '#003F87'] },
  { code: 'MH', numericId: '584', name: 'Marshall Islands', continent: 'Oceania', capital: 'Majuro', defaultIata: 'MAJ', lat: 7.12, lon: 171.18, flagColors: ['#003893', '#DD7500', '#FFFFFF'] },
  { code: 'FM', numericId: '583', name: 'Micronesia', continent: 'Oceania', capital: 'Palikir', defaultIata: 'PNI', lat: 6.92, lon: 158.16, flagColors: ['#75B2DD', '#FFFFFF'] },
  { code: 'NR', numericId: '520', name: 'Nauru', continent: 'Oceania', capital: 'Yaren', defaultIata: 'INU', lat: -0.55, lon: 166.92, flagColors: ['#002B7F', '#FFC61E'] },
  { code: 'NZ', numericId: '554', name: 'New Zealand', continent: 'Oceania', capital: 'Queenstown', defaultIata: 'ZQN', lat: -41.29, lon: 174.78, flagColors: ['#00247D', '#CC142B', '#FFFFFF'] },
  { code: 'PW', numericId: '585', name: 'Palau', continent: 'Oceania', capital: 'Ngerulmud', defaultIata: 'ROR', lat: 7.50, lon: 134.62, flagColors: ['#0099FF', '#FFFF00'] },
  { code: 'PG', numericId: '598', name: 'Papua New Guinea', continent: 'Oceania', capital: 'Port Moresby', defaultIata: 'POM', lat: -9.44, lon: 147.18, flagColors: ['#CE1126', '#000000', '#FCD116'] },
  { code: 'WS', numericId: '882', name: 'Samoa', continent: 'Oceania', capital: 'Apia', defaultIata: 'APW', lat: -13.83, lon: -171.76, flagColors: ['#CE1126', '#002B7F'] },
  { code: 'SB', numericId: '090', name: 'Solomon Islands', continent: 'Oceania', capital: 'Honiara', defaultIata: 'HIR', lat: -9.43, lon: 159.95, flagColors: ['#0051BA', '#FCD116', '#215B33'] },
  { code: 'TO', numericId: '776', name: 'Tonga', continent: 'Oceania', capital: "Nuku'alofa", defaultIata: 'TBU', lat: -21.14, lon: -175.20, flagColors: ['#C10000', '#FFFFFF'] },
  { code: 'TV', numericId: '798', name: 'Tuvalu', continent: 'Oceania', capital: 'Funafuti', defaultIata: 'FUN', lat: -8.52, lon: 179.20, flagColors: ['#009CDE', '#FFCD00'] },
  { code: 'VU', numericId: '548', name: 'Vanuatu', continent: 'Oceania', capital: 'Port Vila', defaultIata: 'VLI', lat: -17.73, lon: 168.32, flagColors: ['#D21034', '#009543', '#000000'] },

  // AFRICA
  { code: 'DZ', numericId: '012', name: 'Algeria', continent: 'Africa', capital: 'Algiers', defaultIata: 'ALG', lat: 36.75, lon: 3.06, flagColors: ['#006233', '#FFFFFF'] },
  { code: 'AO', numericId: '024', name: 'Angola', continent: 'Africa', capital: 'Luanda', defaultIata: 'LAD', lat: -8.84, lon: 13.23, flagColors: ['#CC092F', '#000000'] },
  { code: 'BJ', numericId: '204', name: 'Benin', continent: 'Africa', capital: 'Cotonou', defaultIata: 'COO', lat: 6.37, lon: 2.39, flagColors: ['#008751', '#FCD116', '#E8112D'] },
  { code: 'BW', numericId: '072', name: 'Botswana', continent: 'Africa', capital: 'Gaborone', defaultIata: 'GBE', lat: -24.63, lon: 25.91, flagColors: ['#6DA9D2', '#000000', '#6DA9D2'] },
  { code: 'BF', numericId: '854', name: 'Burkina Faso', continent: 'Africa', capital: 'Ouagadougou', defaultIata: 'OUA', lat: 12.37, lon: -1.52, flagColors: ['#EF2B2D', '#009E49'] },
  { code: 'BI', numericId: '108', name: 'Burundi', continent: 'Africa', capital: 'Bujumbura', defaultIata: 'BJM', lat: -3.38, lon: 29.36, flagColors: ['#CE1126', '#1EB53A', '#FFFFFF'] },
  { code: 'CV', numericId: '132', name: 'Cabo Verde', continent: 'Africa', capital: 'Praia', defaultIata: 'SID', lat: 14.93, lon: -23.51, flagColors: ['#003893', '#CF2027', '#F7D116'] },
  { code: 'CM', numericId: '120', name: 'Cameroon', continent: 'Africa', capital: 'Douala', defaultIata: 'DLA', lat: 3.85, lon: 11.50, flagColors: ['#007A5E', '#CE1126', '#FCD116'] },
  { code: 'CF', numericId: '140', name: 'Central African Republic', continent: 'Africa', capital: 'Bangui', defaultIata: 'BGF', lat: 4.39, lon: 18.56, flagColors: ['#003082', '#289728', '#FFCE00'] },
  { code: 'TD', numericId: '148', name: 'Chad', continent: 'Africa', capital: "N'Djamena", defaultIata: 'NDJ', lat: 12.13, lon: 15.05, flagColors: ['#002664', '#FECB00', '#C60C30'] },
  { code: 'KM', numericId: '174', name: 'Comoros', continent: 'Africa', capital: 'Moroni', defaultIata: 'HAH', lat: -11.72, lon: 43.24, flagColors: ['#FFD100', '#3A75C4', '#CE1126'] },
  { code: 'CG', numericId: '178', name: 'Congo', continent: 'Africa', capital: 'Brazzaville', defaultIata: 'BZV', lat: -4.27, lon: 15.28, flagColors: ['#009543', '#FBDE4A', '#DC241F'] },
  { code: 'CD', numericId: '180', name: 'DR Congo', continent: 'Africa', capital: 'Kinshasa', defaultIata: 'FIH', lat: -4.44, lon: 15.27, flagColors: ['#007FFF', '#F7D618', '#CE1021'] },
  { code: 'CI', numericId: '384', name: "Côte d'Ivoire", continent: 'Africa', capital: 'Abidjan', defaultIata: 'ABJ', lat: 5.36, lon: -4.01, flagColors: ['#F77F00', '#FFFFFF', '#009E60'] },
  { code: 'DJ', numericId: '262', name: 'Djibouti', continent: 'Africa', capital: 'Djibouti', defaultIata: 'JIB', lat: 11.58, lon: 43.15, flagColors: ['#6AB2E7', '#12AD2B', '#FFFFFF'] },
  { code: 'EG', numericId: '818', name: 'Egypt', continent: 'Africa', capital: 'Cairo', defaultIata: 'CAI', lat: 30.04, lon: 31.24, flagColors: ['#CE1126', '#FFFFFF', '#000000'] },
  { code: 'GQ', numericId: '226', name: 'Equatorial Guinea', continent: 'Africa', capital: 'Malabo', defaultIata: 'SSG', lat: 3.75, lon: 8.78, flagColors: ['#3E9A00', '#FFFFFF', '#E32118'] },
  { code: 'ER', numericId: '232', name: 'Eritrea', continent: 'Africa', capital: 'Asmara', defaultIata: 'ASM', lat: 15.32, lon: 38.93, flagColors: ['#4189DD', '#12AD2B', '#EA0437'] },
  { code: 'SZ', numericId: '748', name: 'Eswatini', continent: 'Africa', capital: 'Mbabane', defaultIata: 'SHO', lat: -26.31, lon: 31.14, flagColors: ['#3E5EB9', '#FFD900', '#B10C0C'] },
  { code: 'ET', numericId: '231', name: 'Ethiopia', continent: 'Africa', capital: 'Addis Ababa', defaultIata: 'ADD', lat: 9.03, lon: 38.75, flagColors: ['#078930', '#FCDD09', '#DA121A'] },
  { code: 'GA', numericId: '266', name: 'Gabon', continent: 'Africa', capital: 'Libreville', defaultIata: 'LBV', lat: 0.42, lon: 9.47, flagColors: ['#009E60', '#FCD116', '#3A75C4'] },
  { code: 'GM', numericId: '270', name: 'Gambia', continent: 'Africa', capital: 'Banjul', defaultIata: 'BJL', lat: 13.45, lon: -16.58, flagColors: ['#CE1126', '#0C1C8C', '#3A7728'] },
  { code: 'GH', numericId: '288', name: 'Ghana', continent: 'Africa', capital: 'Accra', defaultIata: 'ACC', lat: 5.60, lon: -0.19, flagColors: ['#CE1126', '#FCD116', '#006B3F'] },
  { code: 'GN', numericId: '324', name: 'Guinea', continent: 'Africa', capital: 'Conakry', defaultIata: 'CKY', lat: 9.64, lon: -13.58, flagColors: ['#CE1126', '#FCD116', '#009460'] },
  { code: 'GW', numericId: '624', name: 'Guinea-Bissau', continent: 'Africa', capital: 'Bissau', defaultIata: 'OXB', lat: 11.86, lon: -15.60, flagColors: ['#CE1126', '#FCD116', '#009E49'] },
  { code: 'KE', numericId: '404', name: 'Kenya', continent: 'Africa', capital: 'Nairobi', defaultIata: 'NBO', lat: -1.29, lon: 36.82, flagColors: ['#000000', '#BB0000', '#006600'] },
  { code: 'LS', numericId: '426', name: 'Lesotho', continent: 'Africa', capital: 'Maseru', defaultIata: 'MSU', lat: -29.31, lon: 27.48, flagColors: ['#00209F', '#FFFFFF', '#009543'] },
  { code: 'LR', numericId: '430', name: 'Liberia', continent: 'Africa', capital: 'Monrovia', defaultIata: 'ROB', lat: 6.30, lon: -10.80, flagColors: ['#BF0A30', '#FFFFFF', '#002868'] },
  { code: 'LY', numericId: '434', name: 'Libya', continent: 'Africa', capital: 'Tripoli', defaultIata: 'TIP', lat: 32.89, lon: 13.19, flagColors: ['#E70013', '#000000', '#239E46'] },
  { code: 'MG', numericId: '450', name: 'Madagascar', continent: 'Africa', capital: 'Antananarivo', defaultIata: 'TNR', lat: -18.88, lon: 47.51, flagColors: ['#FFFFFF', '#FC3D32', '#007E3A'] },
  { code: 'MW', numericId: '454', name: 'Malawi', continent: 'Africa', capital: 'Lilongwe', defaultIata: 'LLW', lat: -13.96, lon: 33.79, flagColors: ['#000000', '#CE1126', '#339E35'] },
  { code: 'ML', numericId: '466', name: 'Mali', continent: 'Africa', capital: 'Bamako', defaultIata: 'BKO', lat: 12.64, lon: -8.00, flagColors: ['#14B53A', '#FCD116', '#CE1126'] },
  { code: 'MR', numericId: '478', name: 'Mauritania', continent: 'Africa', capital: 'Nouakchott', defaultIata: 'NKC', lat: 18.07, lon: -15.96, flagColors: ['#006233', '#FFC400'] },
  { code: 'MU', numericId: '480', name: 'Mauritius', continent: 'Africa', capital: 'Port Louis', defaultIata: 'MRU', lat: -20.16, lon: 57.50, flagColors: ['#EA2839', '#1A206D', '#FFD500'] },
  { code: 'MA', numericId: '504', name: 'Morocco', continent: 'Africa', capital: 'Marrakesh', defaultIata: 'RAK', lat: 33.97, lon: -6.85, flagColors: ['#C1272D', '#006233'] },
  { code: 'MZ', numericId: '508', name: 'Mozambique', continent: 'Africa', capital: 'Maputo', defaultIata: 'MPM', lat: -25.97, lon: 32.57, flagColors: ['#007168', '#000000', '#FCE100'] },
  { code: 'NA', numericId: '516', name: 'Namibia', continent: 'Africa', capital: 'Windhoek', defaultIata: 'WDH', lat: -22.56, lon: 17.08, flagColors: ['#003580', '#D21034', '#009543'] },
  { code: 'NE', numericId: '562', name: 'Niger', continent: 'Africa', capital: 'Niamey', defaultIata: 'NIM', lat: 13.51, lon: 2.13, flagColors: ['#E05206', '#FFFFFF', '#0DB02B'] },
  { code: 'NG', numericId: '566', name: 'Nigeria', continent: 'Africa', capital: 'Lagos', defaultIata: 'LOS', lat: 9.08, lon: 7.40, flagColors: ['#008751', '#FFFFFF', '#008751'] },
  { code: 'RW', numericId: '646', name: 'Rwanda', continent: 'Africa', capital: 'Kigali', defaultIata: 'KGL', lat: -1.94, lon: 30.06, flagColors: ['#00A1DE', '#FAD201', '#20603D'] },
  { code: 'ST', numericId: '678', name: 'São Tomé and Príncipe', continent: 'Africa', capital: 'São Tomé', defaultIata: 'TMS', lat: 0.34, lon: 6.73, flagColors: ['#12AD2B', '#FFCE00', '#D21034'] },
  { code: 'SN', numericId: '686', name: 'Senegal', continent: 'Africa', capital: 'Dakar', defaultIata: 'DSS', lat: 14.72, lon: -17.47, flagColors: ['#00853F', '#FDEF42', '#E31B23'] },
  { code: 'SC', numericId: '690', name: 'Seychelles', continent: 'Africa', capital: 'Victoria', defaultIata: 'SEZ', lat: -4.62, lon: 55.45, flagColors: ['#003F87', '#FCD856', '#D62828'] },
  { code: 'SL', numericId: '694', name: 'Sierra Leone', continent: 'Africa', capital: 'Freetown', defaultIata: 'FNA', lat: 8.48, lon: -13.23, flagColors: ['#1EB53A', '#FFFFFF', '#0072C6'] },
  { code: 'SO', numericId: '706', name: 'Somalia', continent: 'Africa', capital: 'Mogadishu', defaultIata: 'MGQ', lat: 2.05, lon: 45.32, flagColors: ['#4189DD', '#FFFFFF'] },
  { code: 'ZA', numericId: '710', name: 'South Africa', continent: 'Africa', capital: 'Cape Town', defaultIata: 'CPT', lat: -33.92, lon: 18.42, flagColors: ['#007749', '#E03C31', '#001489'] },
  { code: 'SS', numericId: '728', name: 'South Sudan', continent: 'Africa', capital: 'Juba', defaultIata: 'JUB', lat: 4.86, lon: 31.57, flagColors: ['#000000', '#DA121A', '#078930'] },
  { code: 'SD', numericId: '729', name: 'Sudan', continent: 'Africa', capital: 'Khartoum', defaultIata: 'KRT', lat: 15.50, lon: 32.56, flagColors: ['#D21034', '#FFFFFF', '#007229'] },
  { code: 'TZ', numericId: '834', name: 'Tanzania', continent: 'Africa', capital: 'Zanzibar', defaultIata: 'ZNZ', lat: -6.16, lon: 39.20, flagColors: ['#1EB53A', '#FCD116', '#00A3DD'] },
  { code: 'TG', numericId: '768', name: 'Togo', continent: 'Africa', capital: 'Lomé', defaultIata: 'LFW', lat: 6.13, lon: 1.22, flagColors: ['#006A4E', '#FFCE00', '#D21034'] },
  { code: 'TN', numericId: '788', name: 'Tunisia', continent: 'Africa', capital: 'Tunis', defaultIata: 'TUN', lat: 36.81, lon: 10.18, flagColors: ['#E70013', '#FFFFFF'] },
  { code: 'UG', numericId: '800', name: 'Uganda', continent: 'Africa', capital: 'Entebbe', defaultIata: 'EBB', lat: 0.35, lon: 32.58, flagColors: ['#000000', '#FCDC04', '#D90000'] },
  { code: 'ZM', numericId: '894', name: 'Zambia', continent: 'Africa', capital: 'Lusaka', defaultIata: 'LUN', lat: -15.39, lon: 28.32, flagColors: ['#198A00', '#DE2010', '#EF7D00'] },
  { code: 'ZW', numericId: '716', name: 'Zimbabwe', continent: 'Africa', capital: 'Victoria Falls', defaultIata: 'VFA', lat: -17.83, lon: 31.05, flagColors: ['#319208', '#FFD200', '#DE2010'] },
];

export const NUMERIC_TO_COUNTRY = new Map<string, WorldCountryInfo>(
  ALL_WORLD_COUNTRIES.map((c) => [c.numericId, c])
);

export const CODE_TO_COUNTRY = new Map<string, WorldCountryInfo>(
  ALL_WORLD_COUNTRIES.map((c) => [c.code, c])
);
