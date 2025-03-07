// lagre fremgang i localStorage
function saveProgress(day, goal, completed) {
  const key = `progress-${day}-${goal}`;
  const value = JSON.stringify({ completed });
  localStorage.setItem(key, value);
}

//  hente fremgang fra localStorage
function getProgress(day, goal) {
  const key = `progress-${day}-${goal}`;
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value).completed : false;
}

const fetchReadingPlan = async () => {
  try {
    // hente lagret data fra localStorage først
    const storedData = localStorage.getItem('readingPlanData');
    if (storedData) {
      displayReadingPlan(JSON.parse(storedData)); // Hvis data er tilgjengelig, vis den
    } else {
      // Hvis ingen data er i localStorage, gjør et call
      document.getElementById('progressCounter').textContent = "Progress: 0 / 0 days completed"; // Reset progress
      const response = await fetch('/api/tree');
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
      const data = await response.json();

      // Lagre hentet data i localStorage for fremtidig offline tilgang
      localStorage.setItem('readingPlanData', JSON.stringify(data));
      displayReadingPlan(data);
    }
  } catch (error) {
    console.error("Error fetching Quran reading plan:", error);
    // Hvis det oppstår en feil under nettverkskallet, prøv å hente fra localStorage
    const offlineData = localStorage.getItem('readingPlanData');
    if (offlineData) {
      displayReadingPlan(JSON.parse(offlineData));
    } else {
      document.getElementById('readingPlan').innerHTML = "<p>No reading plan available.</p>";
    }
  }
};

const updateProgress = async () => {
const planContainer = document.getElementById('readingPlan');
const checkboxes = planContainer.querySelectorAll('.progress-checkbox');
let completed = 0;

checkboxes.forEach(async (checkbox) => {
    if (checkbox.checked) {
        completed++;
        const day = checkbox.dataset.day;
        const goal = checkbox.dataset.goal;
        await saveProgress(day, goal, checkbox.checked);
    }
});

const progressElement = document.getElementById('progressCounter');
progressElement.textContent = `Progress: ${completed} / ${checkboxes.length} days completed`;
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
    checkbox.checked = await getProgress(day.id, goalData.id);

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

const attachEventListeners = () => {
const goalSelect = document.getElementById('goalSelect');
if (goalSelect) {
    goalSelect.addEventListener('change', fetchReadingPlan);
} else {
    console.error("Error: 'goalSelect' dropdown is missing in HTML.");
}
};

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", attachEventListeners);
} else {
attachEventListeners();
}

fetchReadingPlan();

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
      }, 86400000); // hver 24 timer
    });
  }
});
}
