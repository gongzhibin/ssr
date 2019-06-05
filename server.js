const fs = require('fs');
const path = require('path');
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');

const resolve = file => path.resolve(__dirname, file);
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
const renderer = createBundleRenderer(resolve('./dist/vue-ssr-server-bundle.json'), {
    runInNewContext: false, // 推荐
    template // （可选）页面模板
    // clientManifest // （可选）客户端构建 manifest
});

app.get('*', (req, res) => {
    context.url = req.url;
    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.error(err);
            if (err.code === 404) {
                res.status(404).end('Page not found');
            } else {
                res.status(500).end('Internal Server Error');
            }
        } else {
            res.end(html);
        }
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`server started at localhost:${port}`);
});
