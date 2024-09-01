import { keys } from 'ts-transformer-keys';

export function extractProperties<T extends object>(source: any): Partial<T> {
  // Get the keys of the class prototype
  const classKeys = keys<T>();

  console.log(classKeys, ' here');
  // Extract only the properties that exist in both the source object and the class prototype
  const result: Partial<T> = {};

  for (const key of classKeys) {
    if (key in source) {
      result[key as keyof T] = source[key];
    }
  }

  return result;
}

export function getWeekDates(date: Date) {
  const dayOfWeek = date.getDay(); // Get day of the week (0 = Sunday, 1 = Monday, ...)
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Find the nearest Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);

  // Generate dates from Monday to Sunday
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }

  return week;
}
