require('log-timestamp');
import bodyParser = require("body-parser");
import express = require("express");
import { consts, EnvType } from "consts";
import { Reloader } from "utils/backend-reloading/Reloader";
import sequelize = require("sequelize");
import { DbInitializer } from "utils/data-initializing/DbInitializer";
import * as router from './app/routes/mainRouter';
import { IContainer } from "bottlejs";


export class App {

    public startServer() : void {
        const app = express();
        this.configure(app);
        app.listen(consts.port, () => {
            console.log(`Server started on port: ${consts.port}`);
            console.log(`ENV = ${consts.env}`);
        });
    }

    private configure(app: express.Express): void{
        // support application/json type post data
        app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        // this.app.use(bodyParser.urlencoded({ extended: false }));
        if(consts.env === EnvType.Dev) {
            app.use(this.addDevHeaders);
        }

        app.use(this.getMainRouter());
        this.connectDb();
    }

    private getMainRouter = (): express.RequestHandler => {
        const mainRouterPath = 'app/routes/mainRouter';
        if(consts.env === EnvType.Dev) {
            const reloader = new Reloader();
            reloader.watchFolder('./dist/node_modules', 'app', {
                preReloadCallback: this.preReloadCallback,
                postReloadCallback: this.postReloadCallback
            });
            return reloader.requireMiddleware(mainRouterPath);
        } else {
            return require(mainRouterPath);
        }
    }

    private getContainer = () => {
        return <IContainer>require('app/services/injection-config').container;
    }

    private connectDb = () => {
        this.getSequelize();
    }

    private getSequelize = (): PromiseLike<sequelize.Sequelize> => {
        const dbInitializer = this.getContainer().DbInitializer;
        return dbInitializer.getSequelizeWhenReady();
    }

    private preReloadCallback = () => {
        this.getSequelize().then(sequelize => {
            sequelize.close();    
        });            
    }

    private postReloadCallback = () => {
    }

    private addDevHeaders = (req, res, next) => {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    }
}