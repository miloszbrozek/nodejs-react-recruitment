const rootPath = '/app';

export const consts = {
    dateFormat: 'YYYY-MM-DD',
    navigation: {
        Login: `${rootPath}/login`,
        Users: `${rootPath}/users`,
        Register: `${rootPath}/register`,
        EditUser: {
            navigate: (userId: number) => `${rootPath}/user/edit/${userId}`,
            route: `${rootPath}/user/edit/:id`
        },
        CreateUser: `${rootPath}/user/create`,
        UserTrips: {
            navigate: (userId: number) => `${rootPath}/trips?userId=${userId}`,
            route: `${rootPath}/trips`
        },
        EditUserTrip: {
            navigate: (tripId: number, userId: number) => `${rootPath}/trip/edit/${tripId}?userId=${userId}`,
            route: `${rootPath}/trip/edit/:id`
        },
        CreateUserTrip: {
            navigate: (userId: number) => `${rootPath}/trip/create?userId=${userId}`,
            route: `${rootPath}/trip/create`
        }
    }
}