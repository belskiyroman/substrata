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

### Debug DB in `development` mode

In `development` you have a special endpoint that returns DB snapshot.

```javascript
if (process.env.NODE_ENV === 'development') {
  app.get('/db', showDB)
}
```

### API doc

You can use a postman collection as an API documentation and be able to call API endpoints.
You can find a `postman_collection.json` at the root of the project.
Just import it to a postman.

### API endpoints

By default PORT is 3000: `http://localhost:3000`

 - GET `/db` - get snapshot of DB
 - GET `/_health` - health check of the server
 - POST `/v1/users` - create a new user
 - GET `/v1/users/:userId` - get a user
 - PUT `/v1/users/:userId` - update a user
 - GET `/v1/users/:userId/balance` - get user balance
 - POST `/v1/users/:userId/usd` - manage usd balance
 - POST `/v1/users/:userId/bitcoins` - manage bitcoin balance
 - GET `/v1/bitcoin` - get current bitcoin exchange rate
 - PUT `/v1/bitcoin` - update bitcoin exchange rate
