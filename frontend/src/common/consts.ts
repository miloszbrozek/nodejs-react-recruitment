export const consts = {
    dateFormat: 'YYYY-MM-DD',
    apiPath: 'http://localhost:8080/api/',
    navigation: {
        Login: '/login',
        Users: '/users',
        Register: '/register',
        EditUser: {
            navigate: (userId: number) => `/user/edit/${userId}`,
            route: `/user/edit/:id`
        },
        CreateUser: '/user/create',
        UserTrips: {
            navigate: (userId: number) => `/trips?userId=${userId}`,
            route: `/trips`
        },
        EditUserTrip: {
            navigate: (tripId: number, userId: number) => `/trip/edit/${tripId}?userId=${userId}`,
            route: '/trip/edit/:id'
        },
        CreateUserTrip: {
            navigate: (userId: number) => `/trip/create?userId=${userId}`,
            route: '/trip/create'
        }
    }
}