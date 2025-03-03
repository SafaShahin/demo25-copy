const treeData = {
  id: 1,
  name: "Ramadan Quran Reading Plan",
  children: []
};

// Generate 30 days 
const pagesPerGoal = {
  "1 completion": 20,
  "2 completions": 40,
  "3 completions": 60,
  "5 completions": 100,
  "10 completions": 200
};

for (let day = 1; day <= 30; day++) {
  let dayNode = {
      id: day + 1,
      name: `Day ${day}`,
      children: []
  };

  let startPage = (day - 1) * 20 + 1;

  Object.keys(pagesPerGoal).forEach((goal, index) => {
      dayNode.children.push({
          id: day * 10 + index + 1,
          name: `${goal} → Read pages ${startPage} - ${startPage + pagesPerGoal[goal] - 1}`
      });
  });

  treeData.children.push(dayNode);
}

// FOR ES MODULES (.mjs)
export { treeData };
