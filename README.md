###Requirements
1. User is able to register and log in.
2. Logged in user can CRUD trips he entered.
3. Implement 3 roles:
  * regular user - can RUD on his own records
  * manager user - can CRUD users
  * admin user - can CRUD all records and users
4. A trip has following attributes: comment, destination, start and end dates
5. Future trips have day count to trip start.
6. User is able to filter trips
7. User is able to print a travel plan for next month.
8. All actions can be triggerred through REST API.

### How to run the app
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

Write an application for travel plans

1. User is able to register and log in.
2. Logged in user can CRUD trips he entered.
3. Implement 3 roles:
 - regular user - can CRUD on his own records
 - manager user - can CRUD users
 - admin user - can CRUD all records and users
4. A trip has following attributes: comment, destination, start and end dates
5. Future trips have day count to trip start.
6. User is able to filter trips
7. User is able to print a travel plan for next month.
8. All actions can be triggerred through REST API.
