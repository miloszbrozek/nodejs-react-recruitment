# How to run the app
First, start the database by running following commands:
```
cd ./db
npm run start
```
Then in another terminal build the backed in watch mode:
```
cd ./backend
npm run build-watch
```
Then in another terminal start the bakcend app (it runs on 5000 port of localhost). Right now when the app starts it reinitializes the database, this also happens when backend code is changed.:
```
cd ./backend
npm run start
```
Then in another terminal start the frontend app (it runs on 1234 port of localhost and proxies all requests to the backend on 5000):
```
cd ./frontend
npm run start:proxy
```
