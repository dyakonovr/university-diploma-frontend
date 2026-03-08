type DateFormatOptions = {
  locale?: string;
  timeZone?: string;
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  hour12?: boolean;
  outputPattern?: string;
};

// Чтобы например убрать секунды, пропишите в настройках { second: undefined, ... }
export function formatDateToNormalized(
  date: string | Date,
  options: DateFormatOptions = {},
) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: DateFormatOptions = {
    locale: 'ru-RU',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    outputPattern: '$3.$2.$1 $4:$5:$6', // Год.Месяц.День Час:Минута:Секунда
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const formattedDate = dateObj.toLocaleString(mergedOptions.locale, {
    year: mergedOptions.year,
    month: mergedOptions.month,
    day: mergedOptions.day,
    hour: mergedOptions.hour,
    minute: mergedOptions.minute,
    second: mergedOptions.second,
    hour12: mergedOptions.hour12,
    timeZone: mergedOptions.timeZone,
  });

  const replacePattern = mergedOptions.outputPattern
    ? mergedOptions.outputPattern
    : '$3.$2.$1 $4:$5:$6';

  const result = formattedDate.replace(
    /(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
    replacePattern,
  );

  return result.replace(/,/g, '');
}
