// Local browser storage adapter used for the public HealthBuddy AI demo.
// It keeps the app functional without requiring a paid backend or login server.

const GUEST_USER = {
  id: 'guest-user',
  name: 'Guest User',
  email: 'guest@healthbuddy.local',
};

function readRecords(collectionName) {
  try {
    return JSON.parse(localStorage.getItem(`healthbuddy_${collectionName}`) || '[]');
  } catch {
    return [];
  }
}

function writeRecords(collectionName, records) {
  localStorage.setItem(`healthbuddy_${collectionName}`, JSON.stringify(records));
}

function getValue(record, field) {
  return record?.[field];
}

function matchesFilter(record, filter = '') {
  if (!filter) return true;

  const parts = filter.split(/\s+&&\s+/g).map((part) => part.trim()).filter(Boolean);
  return parts.every((part) => {
    const m = part.match(/^([A-Za-z0-9_]+)\s*(=|>=|<)\s*"([^"]*)"$/);
    if (!m) return true;
    const [, field, op, expected] = m;
    const actual = String(getValue(record, field) ?? '');
    if (op === '=') return actual === expected;
    if (op === '>=') return actual >= expected;
    if (op === '<') return actual < expected;
    return true;
  });
}

function sortRecords(records, sort = '') {
  if (!sort) return records;
  const descending = sort.startsWith('-');
  const field = descending ? sort.slice(1) : sort;
  return [...records].sort((a, b) => {
    const av = String(a?.[field] ?? '');
    const bv = String(b?.[field] ?? '');
    if (av === bv) return 0;
    return descending ? (av < bv ? 1 : -1) : (av > bv ? 1 : -1);
  });
}

const pb = {
  authStore: {
    isValid: true,
    model: GUEST_USER,
    onChange(callback) {
      callback('local-demo-token', GUEST_USER);
      return () => {};
    },
    clear() {},
  },
  collection(collectionName) {
    return {
      async getFullList(options = {}) {
        const records = readRecords(collectionName).filter((record) => matchesFilter(record, options.filter));
        return sortRecords(records, options.sort);
      },
      async create(data = {}) {
        const records = readRecords(collectionName);
        const record = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          ...data,
        };
        records.push(record);
        writeRecords(collectionName, records);
        return record;
      },
      async update(id, data = {}) {
        const records = readRecords(collectionName);
        const index = records.findIndex((record) => record.id === id);
        if (index === -1) {
          const created = { id, created: new Date().toISOString(), updated: new Date().toISOString(), ...data };
          records.push(created);
          writeRecords(collectionName, records);
          return created;
        }
        records[index] = { ...records[index], ...data, updated: new Date().toISOString() };
        writeRecords(collectionName, records);
        return records[index];
      },
      async authWithPassword() {
        return { record: GUEST_USER };
      },
    };
  },
};

export default pb;
