import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

const dbPromise = openDB('QuranReadingTracker', 1, {
  upgrade(db) {
    db.createObjectStore('progress', { keyPath: 'id' });
  },
});

export async function saveProgress(day, goal, completed) {
  const db = await dbPromise;
  const tx = db.transaction('progress', 'readwrite');
  await tx.store.put({ id: `${day}-${goal}`, completed });
  await tx.done;
}

export async function getProgress(day, goal) {
  const db = await dbPromise;
  return (await db.get('progress', `${day}-${goal}`))?.completed || false;
}
