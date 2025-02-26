import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/build/esm/index.js';

const dbPromise = openDB('LocalLibraryDB', 1, {
    upgrade(db) {
      db.createObjectStore('treeData', { keyPath: 'id' });
    },
});

// Function: save data
async function saveData(data) {
  const db = await dbPromise;
  const tx = db.transaction('treeData', 'readwrite');
  const store = tx.objectStore('treeData');
  data.forEach((item) => store.put(item));
  await tx.done;
}

// Function: get cached data
async function getCachedData() {
  const db = await dbPromise;
  return db.getAll('treeData');
}

// Fetch API and cache the response
async function fetchAndCacheData() {
  try {
    const response = await fetch('/api/tree');
    const data = await response.json();
    saveData(data);
    return data;
  } catch (error) {
    console.log("Offline mode: Using cached data");
    return getCachedData();
  }
}

// Load data on page load
fetchAndCacheData().then(data => console.log("Data:", data));
