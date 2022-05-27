## SW-Capital backend

#### Getting started

1. `yarn`
2. `yarn start`
   - First verifies and compiles from TypeScript to JavaScript
   - Run `app.js` in `./build` using the launcher script in `./bin/www`
   - Use Nodemon to monitor for file changes (ToDo)
3. If `PORT` in `.env` app uses that port, see `./src/settings.ts` for other config

App can be accessed on `localhost:PORT`.

#### Tech stack

- Express server
- Jest for (unit)testing
- Axios for async HTTP requests
- OpenAPI for API spec and [Typescript generation](https://www.npmjs.com/package/openapi-typescript)
- Apollo Client for GraphQL queries
- Apollo server for mocking/testing purposes

`yarn run openapi-typescript ./docs/api.yaml --output types/api-schema.ts`

#### Routes

`/quotes/{buyToken}/{sellToken}/{sellAmount}`

`/prices/{buyToken}/{sellToken}/{sellAmount}`
