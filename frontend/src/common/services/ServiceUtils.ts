export class ServiceUtils {
    public checkError = (response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response;
    }

    public handleError = (err) => {
        console.error(err);
    }

    public getJsonHeaders = () => {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
}

export const serviceUtils = new ServiceUtils();