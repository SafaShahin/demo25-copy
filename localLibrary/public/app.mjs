import { saveProgress, getProgress } from './idb.js';

const fetchReadingPlan = async () => {
  try {
      document.getElementById('progressCounter').textContent = "Progress: 0 / 0 days completed"; // Reset progress
      const response = await fetch('/api/tree'); 
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);

      const data = await response.json();
      displayReadingPlan(data);
  } catch (error) {
      console.error("Error fetching Quran reading plan:", error);
  }
};

const updateProgress = async () => {
  const planContainer = document.getElementById('readingPlan');
  const checkboxes = planContainer.querySelectorAll('.progress-checkbox');
  let completed = 0;

  for (let checkbox of checkboxes) {
      if (checkbox.checked) completed++;
  }

  const progressElement = document.getElementById('progressCounter');
  if (progressElement) { 
      progressElement.textContent = `Progress: ${completed} / ${checkboxes.length} days completed`;
  }
};

const displayReadingPlan = async (data) => {
  const planContainer = document.getElementById('readingPlan');
  const goalSelect = document.getElementById('goalSelect');

  planContainer.innerHTML = '';

  if (!data.children || data.children.length === 0) {
    planContainer.innerHTML = "<p>No reading plan available.</p>";
    return;
  }

  for (const day of data.children) {
    let dayElement = document.createElement('div');
    dayElement.classList.add('list-group-item');

    dayElement.innerHTML = `<h4>${day.name}</h4>`;

    let list = document.createElement('ul');
    const selectedGoal = goalSelect.value;
    const goalData = day.children?.find(goal => goal.name.startsWith(selectedGoal));

    if (goalData) {
      let listItem = document.createElement('li');
      listItem.textContent = goalData.name;

      // Checkbox for tracking
      let checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('progress-checkbox');
      checkbox.dataset.day = day.id;
      checkbox.dataset.goal = goalData.id;

      checkbox.id = `checkbox-${day.id}-${goalData.id}`;
      checkbox.name = `progress-${day.id}-${goalData.id}`; 

      const savedProgress = await getProgress(day.id, goalData.id);
      checkbox.checked = savedProgress === true;

      checkbox.addEventListener('change', async () => {
        await saveProgress(day.id, goalData.id, checkbox.checked);
        updateProgress();  
      });

      listItem.prepend(checkbox);
      list.appendChild(listItem);
    } else {
      let listItem = document.createElement('li');
      listItem.textContent = "No goal for selected option.";
      list.appendChild(listItem);
    }

    dayElement.appendChild(list);
    planContainer.appendChild(dayElement);
  }
  updateProgress();  
};

// Listen for dropdown selection
const attachEventListeners = () => {
  const goalSelect = document.getElementById('goalSelect');
  if (goalSelect) {
      goalSelect.addEventListener('change', fetchReadingPlan);
  } else {
      console.error("Error: 'goalSelect' dropdown is missing in HTML.");
  }
};

// Ensure the script runs only after the DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attachEventListeners);
} else {
  attachEventListeners();
}

// Load initial plan
fetchReadingPlan();

//  Notification Feature 
if ('Notification' in window && 'serviceWorker' in navigator) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        console.log("Service worker ready for notifications!");
        setInterval(() => {
          registration.showNotification('Ramadan Quran Reminder', {
            body: "Don't forget your daily Quran reading!",
            icon: '/favicon.ico'
          });
        }, 86400000); // Every 24 hours
      });
    }
  });
}
