const express = require('express');
const app = express();
const request = require('request');

const fishData = require('./data/fish.json')
const velocityData = require('./data/aviso.json')
const fadData = require('./data/FAD.json')
const cors = require('cors')
const bp = require('body-parser');
const exphbs = require('express-handlebars');

const PORT = 5000;

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(bp.urlencoded({ extended: false }));
app.use(express.static('.'));

const Inventory = require('./db/DS_Inventory.js')
const DS_Inv = new Inventory();

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')
app.use(cors())
app.use(bp.urlencoded({ extended: false }))


app.get('/fad', (req, res) => {
  res.render('form')
});

app.get("/proxy", (req, res) => {
  const downloading = req.query.url;
  if (downloading.includes("GetCapabilities")) {
      request(downloading, function (error, response, body) {
          if (!error && response.statusCode === 200) {
              res.header("Content-Type", response.headers["content-type"])
              res.send(body)
          }
      })
  }
});

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.get('/fad/:id', (req, res) => {

  // console.log('req', req)
  let { id } = req.params;
  console.log('id', id)
  console.log('req.query', req.query)
  let coords = req.query;
  console.log('coords', coords);

  let FAD_detail = DS_Inv.getItemById(id);
  console.log('FAD_detail', FAD_detail);

  // const { id } = req.params;
  // console.log('FAD-id: ', id);

  // console.log(item);
  // temp = item;
  // console.log('temp', temp)
  // console.log('item.id', item.id);
  // res.render('detail', item)
  res.render('detail', FAD_detail)
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/login', (req, res) => {
  res.redirect('/fad');
})

app.post('/fad', (req, res) => {
  const item = req.body;
  // console.log(item);
  DS_Inv.add(item);
  res.redirect('/')
})

app.get('/fish', (req, res) => {
  res.json(fishData)
})

app.get('/velocity', (req, res) => {
  res.json(velocityData)
})

app.get('/fadData', (req, res) => {
  res.json(fadData)
})

app.listen(PORT)
