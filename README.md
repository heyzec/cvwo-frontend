# CVWO AY21/22 Assignment - Frontend
## Quick links
[Main](https://github.com/heyzec/cvwo-assignment) • [Backend](https://github.com/heyzec/cvwo-backend) • [Link to deployment](https://heyzec-cvwo.netlify.app/)

## Other info
[![Netlify Status](https://api.netlify.com/api/v1/badges/3fe42e9f-79c3-4fd4-b95d-2b0c31a4235e/deploy-status)](https://app.netlify.com/sites/heyzec-cvwo/deploys)
![Repo size](https://img.shields.io/github/repo-size/heyzec/cvwo-frontend)

## Dependencies
|Library|Purpose|
|---|---|
|[md5](https://github.com/pvorb/node-md5)|Generate hashes to compare the state of data, required for syncing|
|[identicon.js](https://github.com/stewartlord/identicon.js)|To generate Github-like avatar profile pictures|
|[mui](https://mui.com/) + [emotion](https://mui.com/getting-started/installation/#npm)|For beautiful date and time picker|
|[dayjs](https://github.com/iamkun/dayjs)|Datetime library (also required by mui's pickers|
|[json-server](https://github.com/typicode/json-server)|No longer required, used during early stage testing|

## Local deployment
Note: Frontend runs on port 4000, while backend runs on port 3000. (By default, React will use port 3000).

Click here for [backend](https://github.com/heyzec/cvwo-backend#local-deployment) instructions.

### Frontend instructions
0. Clone this repository and `cd` into it.
1. Rename [`.env.development.example`](.env.development.example) to `.env/development`.
2. `npm install`
3. `npm start` to start the app in development mode. Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits.


### Environment variables
_If you want to test out the OAuth login feature, you'll need to grab some credentials from GitHub and Google._
|Variable|Notes|
|---|---|
|REACT_APP_FRONTEND_URL|Required, without trailing slash|
|REACT_APP_BACKEND_URL|Required, without trailing slash|
|REACT_APP_AUTH_GITHUB_CLIENT_ID||
|REACT_APP_AUTH_GOOGLE_CLIENT_ID||
