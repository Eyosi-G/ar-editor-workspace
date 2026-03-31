export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatBytesIntl(bytes: number, locale = navigator.language) {
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'];
  const kilobyte = 1024;
  
  if (bytes === 0) return '0 Bytes';

  const i = Math.floor(Math.log(bytes) / Math.log(kilobyte));
  const value = bytes / Math.pow(kilobyte, i);

  const formatter = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: units[i],
    unitDisplay: 'short', // 'short', 'narrow', or 'long'
    maximumFractionDigits: 2, // Adjust precision as needed
  });

  return formatter.format(value);
}
