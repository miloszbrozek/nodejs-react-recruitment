import {Model, Sequelize} from 'sequelize';
import * as bluebird from 'bluebird';

export interface ModelInitializationEntry {
    model: typeof Model;
    initDataFn?: () => PromiseLike<any>;
    initRelations?: () => void;
}

export class DbInitializer {

    private initialized = false;

    constructor(private sequelize: Sequelize,
        private initConfig: ModelInitializationEntry[]) {

    }

    private dropTables() {
        const reversedEntries = this.initConfig.slice().reverse();
        return bluebird.Promise.each(reversedEntries, entry => entry.model.drop());
    }

    private createTables() {
        return bluebird.Promise.each(this.initConfig, entry => entry.model.sync({ force: true }));
    }

    private initData() {
        return bluebird.Promise.each(this.initConfig, entry => {
            return entry.initDataFn ? entry.initDataFn() : Promise.resolve();
        });
    }

    private initRelations() {
        return bluebird.Promise.each(this.initConfig, entry => {
            return entry.initRelations ? Promise.resolve(entry.initRelations()) : Promise.resolve();
        });
    }

    getSequelizeWhenReady(): PromiseLike<Sequelize> {
        if (this.initialized) {
            return bluebird.Promise.resolve(this.sequelize);
        } else {
            this.initialized = true;
            return this.initRelations()
                .then(() => this.dropTables()
                .then(() => this.createTables())
                .then(() => this.initRelations())
                .then(() => this.initData())
                .then(() => this.sequelize));
        }
    }
}