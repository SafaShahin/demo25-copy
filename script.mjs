import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

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

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
}); // Dette er en test