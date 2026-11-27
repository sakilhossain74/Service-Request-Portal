export const getTodayDateString = (now = new Date()) => {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseAndValidateDueDate = (rawValue, now = new Date()) => {
  if (!rawValue || typeof rawValue !== 'string') {
    return { error: 'Due date is required' };
  }

  const trimmed = rawValue.trim();
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  let parsedDate;
  let calendarDateStr;

  if (dateOnlyMatch) {
    const [, y, m, d] = dateOnlyMatch;
    parsedDate = new Date(`${y}-${m}-${d}T23:59:59.999Z`);
    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.getUTCFullYear() !== Number(y) ||
      parsedDate.getUTCMonth() + 1 !== Number(m) ||
      parsedDate.getUTCDate() !== Number(d)
    ) {
      return { error: 'Please provide a valid due date' };
    }
    calendarDateStr = `${y}-${m}-${d}`;
  } else {
    parsedDate = new Date(trimmed);
    if (Number.isNaN(parsedDate.getTime())) {
      return { error: 'Please provide a valid due date' };
    }
    calendarDateStr = parsedDate.toISOString().slice(0, 10);
  }

  const todayStr = getTodayDateString(now);
  if (calendarDateStr < todayStr) {
    return { error: 'Due date cannot be in the past' };
  }

  return { date: parsedDate };
};

export const computeIsOverdue = (requestDoc, now = new Date()) => {
  if (!requestDoc?.dueDate || requestDoc.status === 'Resolved') {
    return false;
  }
  return new Date(requestDoc.dueDate) < now;
};

export const attachOverdueFlag = (requestDoc, now = new Date()) => {
  if (!requestDoc) return requestDoc;
  const plain = typeof requestDoc.toObject === 'function' ? requestDoc.toObject() : { ...requestDoc };
  plain.isOverdue = computeIsOverdue(plain, now);
  return plain;
};
