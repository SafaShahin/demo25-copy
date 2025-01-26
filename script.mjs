import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import { v4 as uuidv4 } from 'uuid';

const server = express();
const port = (process.env.PORT || 8000);


server.set('port', port);
server.use(express.static('public'));

const decks = {};

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

server.get("/", getRoot);


// Rute for "/tmp/poem"
function getPoem(req, res, next) {
    const poem = `
        Roses are red,
        Violets are blue,
        Express is fun,
        And so are you.
    `;
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}

server.get("/tmp/poem", getPoem);

// Rute for "/tmp/quote"
function getQuote(req, res, next) {
    const quotes = [
        " The only limit to our realization of tomorrow is our doubts of today.  Franklin D. Roosevelt",
        "Do not watch the clock. Do what it does. Keep going.  Sam Levenson",
        "The future belongs to those who believe in the beauty of their dreams.  Eleanor Roosevelt",
        "It always seems impossible until its done.  Nelson Mandela",
        "Believe you can and you're halfway there.  Theodore Roosevelt"
    ];

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}

server.get("/tmp/quote", getQuote);

// Rute for "/tmp/sum/:a/:b" POST-metode
server.post('/tmp/sum/:a/:b', (req, res) => {
    const a = parseFloat(req.params.a); 
    const b = parseFloat(req.params.b); 

    if (isNaN(a) || isNaN(b)) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST)
                  .send('Both parameters must be valid numbers.')
                  .end();
    }

    const sum = a + b; 
    res.status(HTTP_CODES.SUCCESS.OK)
       .send(`The sum of ${a} and ${b} is ${sum}.`)
       .end();
});

//kortstokk
server.post('/temp/deck', (req, res) => {
    const deckId = uuidv4();
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    const deck = suits.flatMap(suit => ranks.map(rank => ({ suit: suit.toLowerCase(), rank: rank.toLowerCase() })));

    decks[deckId] = deck;

    res.status(HTTP_CODES.SUCCESS.OK).send({ deckId }).end();
});

server.patch('/temp/deck/shuffle/:deck_id', (req, res) => {
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send('Deck not found.').end();
    }

    decks[deck_id] = decks[deck_id].sort(() => Math.random() - 0.5);

    res.status(HTTP_CODES.SUCCESS.OK).send('Deck shuffled.').end();
});

server.get('/temp/deck/:deck_id', (req, res) => {
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send('Deck not found.').end();
    }

    res.status(HTTP_CODES.SUCCESS.OK).send(decks[deck_id]).end();
});

server.get('/temp/deck/:deck_id/card', (req, res) => {
    const { deck_id } = req.params;

    console.log(`Attempting to draw a card from deck ${deck_id}`);  // Log the deck_id

    if (!decks[deck_id]) {
        console.log(`Deck not found: ${deck_id}`);
        return res
            .status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
            .send('Kortstokk ikke funnet.')
            .end();
    }

    const card = decks[deck_id].pop();  // Draw a card

    console.log(`Remaining cards in deck ${deck_id}:`, decks[deck_id].length);  // Log remaining cards in deck

    if (!card) {
        console.log(`Deck ${deck_id} is empty.`);
        return res
            .status(HTTP_CODES.CLIENT_ERROR.GONE)
            .send('Ingen kort igjen i kortstokken.')
            .end();
    }

    console.log(`Card drawn from deck ${deck_id}:`, card);  // Log the card that was drawn

    res.status(HTTP_CODES.SUCCESS.OK).send({ card }).end();
});



server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
}); // Dette er en test