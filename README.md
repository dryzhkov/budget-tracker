# Budget Tracker

This is a simple web app that allows user to track spending. It is build using React, NodeJS and MongoDB.

## Installing

```bash
git clone 'this-repo-url' app-name
cd app-name
npm install
```

## Running The App

The web app can be run in development, or in production.

### Dev server

```bash
npm start
```
This will build and start up both front end and the server.

### Production build

```bash
npm run build
cd server
npm start
```

## Deployment (useful commands)
```bash
cat /etc/apache2/sites-available/dimaryz.com-le-ssl.conf 
pm2 (start|show) server
scp -r server/* <user@server-hostname>:/home/budgettracker/
mv /var/www/dimaryz.com/server/* /home/budgettracker/
```
