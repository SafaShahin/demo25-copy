let deckId = null; //  deckId for kortstokken

//  HTML-elementer
const createDeckBtn = document.getElementById('create-deck');
const shuffleDeckBtn = document.getElementById('shuffle-deck');
const drawCardBtn = document.getElementById('draw-card');
const deckInfo = document.getElementById('deck-info');
const cardDisplay = document.getElementById('card-display');

// Opprett ny kortstokk
createDeckBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/temp/deck', { method: 'POST' });
        if (!response.ok) throw new Error('Kunne ikke opprette kortstokk.');
        const data = await response.json();
        deckId = data.deckId;

        deckInfo.textContent = `Kortstokk opprettet! ID: ${deckId}`;
        shuffleDeckBtn.disabled = false;
        drawCardBtn.disabled = false;
    } catch (error) {
        deckInfo.textContent = `Feil: ${error.message}`;
    }
});

// Stokk kortstokk
shuffleDeckBtn.addEventListener('click', async () => {
  if (!deckId) return;
  await fetch(`/temp/deck/shuffle/${deckId}`, { method: 'PATCH' });
  deckInfo.textContent = `Kortstokk stokket! ID: ${deckId}`;
});

// Trekk et kort
drawCardBtn.addEventListener('click', async () => {
    try {
        if (!deckId) return;

        const response = await fetch(`/temp/deck/${deckId}/card`, { method: 'GET' });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Kortstokk ikke funnet.');  
            }
            if (response.status === 410) {
                throw new Error('Ingen kort igjen i kortstokken.');  
            }
            throw new Error('Noe gikk galt.');  
        }

        const data = await response.json();
        const { suit, rank } = data.card;
        const cardFileName = `${rank}_of_${suit}.png`;

        cardDisplay.innerHTML = `
          <img src="/images/${cardFileName}" alt="${rank} of ${suit}" style="width: 150px; height: auto;" />
        `;
    } catch (error) {
        console.error("Error while drawing card:", error); 
        cardDisplay.textContent = `Feil: ${error.message}`;
    }
});

