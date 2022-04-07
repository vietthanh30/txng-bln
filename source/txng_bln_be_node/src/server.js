const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Constant = require('./confs/constant');
const rootRouter = require('./routes');

const app = new express();
app.use(cors(), bodyParser.json());
app.use('/api', rootRouter);

app.listen(Constant.SERVER_PORT, () => {
    console.log(
        `Server started on port: ${Constant.SERVER_PORT}! Go to http://localhost:${Constant.SERVER_PORT}/api`
    );
});

