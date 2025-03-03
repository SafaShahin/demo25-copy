const fetchReadingPlan = async () => {
  try {
    const response = await fetch('/api/tree');
    const data = await response.json();
    displayReadingPlan(data);
  } catch (error) {
    console.error("Error fetching tree data:", error);
  }
};

const displayReadingPlan = (data) => {
  const planContainer = document.getElementById('readingPlan');
  planContainer.innerHTML = '';

  data.children.forEach(day => {
      let dayElement = document.createElement('div');
      dayElement.classList.add('list-group-item');
      dayElement.innerHTML = `<h4>${day.name}</h4>`;

      let list = document.createElement('ul');
      day.children.forEach(goal => {
          let listItem = document.createElement('li');
          listItem.textContent = goal.name;
          list.appendChild(listItem);
      });

      dayElement.appendChild(list);
      planContainer.appendChild(dayElement);
  });
};

// Fetch data on page load
fetchReadingPlan();
