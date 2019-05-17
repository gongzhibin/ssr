const fs = require('fs');
const path = require('path');
const express = require('express');
const { createRenderer } = require('vue-server-renderer');
const resolve = file => path.resolve(__dirname, file);
const createApp = require('./src/app');
const context = {
    title: 'Vue SSR',
    meta: `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
    `
};

const app = express();
const templatePath = resolve('./src/index.template.html');
const template = fs.readFileSync(templatePath, 'utf-8');
const renderer = createRenderer({ template });

app.get('*', (req, res) => {
    const ctx = { url: req.url };
    const app = createApp(ctx);

    renderer.renderToString(app, context, (err, html) => {
        if (err) {
            res.status(500).end('Internal Server Error');
            return;
        }
        res.end(html);
    });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
});