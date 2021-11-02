const express = require('express');
const Datastore = require('nedb');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const collections = {
  aliadas: new Datastore('./src/database/collections/aliadas.db')
};

collections.aliadas.loadDatabase();

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => { console.log(`App: ${PORT}`) });

app.post('/addaliada', (req, res) => {
  const data = req.body;
  data.time = Date.now()
  collections.aliadas.insert(data);
  res.json({ status: true });
});

app.post('/removealiada', (req, res) => {
  const id = req.body.id;
  collections.aliadas.remove({ _id: id });
  res.json({ status: true });
});

app.get('/aliadas', async (req, res) => {
  const result = await new Promise((resolve, reject) => {
    collections.aliadas.find({}, (err, data) => {
      resolve(data);
    });
  });

  res.json({ data: result });
});