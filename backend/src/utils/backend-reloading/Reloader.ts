import * as path from 'path';
import { RequestHandler } from 'express';
const watch = require('node-watch');

type ReloadCallback = {
    (path: string): void;
}

type WatchFolderOptions = {
    postReloadCallback?: ReloadCallback,
    preReloadCallback?: ReloadCallback
}

export class Reloader {

    public watchFolder(pathFromCwd: string, folderName: string, options?: WatchFolderOptions) {
        const absolutePath = path.resolve(pathFromCwd+'/'+folderName);
        console.log(`Reloader configured to watch for changes in ${absolutePath}`);
        const { preReloadCallback, postReloadCallback} = options || <any>{};
        watch(absolutePath, {recursive: true, filter: /\.js$/}, (event, filename) => {
            if(filename) {
                // console.log("File changed: " + filename);

                if (preReloadCallback) {
                    preReloadCallback(filename);
                }

                Object.keys(require.cache).forEach(function(id) {
                    const watchFolderRegex = new RegExp('[\\/\\\\]'+folderName+'[\\/\\\\]');
                    if (watchFolderRegex.test(id)) delete require.cache[id];
                });

                if (postReloadCallback) {
                    postReloadCallback(filename);
                }
            }
        });
    }

    public requireMiddleware(requirePath: string): RequestHandler {
        return (req, res, next) => {
            require(requirePath)(req, res, next);
        }
    }

}