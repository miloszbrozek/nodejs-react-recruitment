export type StringMap = {
    [key: string]: string;
}

// urls like ?id=<some_id> - params in axios implementation
export type QueryInput<T extends StringMap> = {
    query?: T;
}
 
// request body
export type BodyInput<T> = {
    body?: T;
}

// urls like '/:id' - not present in axios implementation
export type ParamsInput<T extends StringMap> = {
    params?: T;
}

export type RequestType<Params extends StringMap, Query extends StringMap, Body> = QueryInput<Query> & BodyInput<Body> & ParamsInput<Params> & {
    url: string,
    method: string
}