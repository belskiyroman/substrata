# substrata API

### Install

Project was builded with engines:
```
  "node": "~14.7.0"
  "npm": "~6.14.11"
```

To start API, you should do next commands:
```bash
npm i
npm start
```
The project will be started in `development` mode.
In development is used `ts-node-dev` to hot reload on changes.
Also, it will preload `.env` file with `-r dotenv/config`.

### On production

To start API on production, you should do next commands:
```bash
npm ci
npm build
npm test
npm run start:prod
```

