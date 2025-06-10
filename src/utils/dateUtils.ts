export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
};

export const formatDateWithWeekday = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
};

export const addDays = (dateString: string, days: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
};

export const getDayLabel = (dayNumber: number, startDate: string | null): string => {
  if (!startDate) {
    return `Day ${dayNumber}`;
  }
  
  const targetDate = addDays(startDate, dayNumber - 1);
  return formatDateWithWeekday(targetDate);
}; 