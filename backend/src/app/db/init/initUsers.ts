import { User } from "../models/User";
import * as moment from 'moment';
import { Trip } from "../models/Trip";

const getDate = (value: string) => {
    return moment(value, 'YYYY-MM-DD').toDate();
}

const initRegularUser = () => {
    return User.create({
        firstName: 'John',
        lastName: 'Regular',
        login: 'regular_user',
        // password = 'password'
        password: '$2b$10$uybY9YVFgLU5hBwE5zfJwuHrYSEFo9nGQN3jWsNiCGv9F/u9HlslG',
        type: 'regular',
        trips: [{
            startDate: getDate('2019-06-19'),
            endDate: getDate('2019-06-25'),
            comment: 'Some regular trip',
            destination: 'Strzebrzeszyn'
        }, {
            startDate: getDate('2019-06-20'),
            endDate: getDate('2019-06-23'),
            comment: 'A trip from past',
            destination: 'Kraków'
        }, {
            startDate: getDate('2019-07-22'),
            endDate: getDate('2019-08-01'),
            destination: 'Warszawa',
            comment: 'A trip from future'
        }]
    }, {
        include: [Trip]
    });
}

const initManagerUser = () => {
    return User.create({
        firstName: 'Bruce',
        lastName: 'Manager',
        login: 'manager_user',
        // password = 'password'
        password: '$2b$10$OiNtUpRCTC./Z26XjWP57erMz7UCcWnWjv1kseYn4YM1tYYK50wc2',
        type: 'manager',
        trips: [{
            startDate: getDate('2019-07-01'),
            endDate: getDate('2019-09-22'),
            comment: 'Some management trip',
            destination: 'Łódź'
        }]
    }, {
        include: [Trip]
    });
}

const initAdminUser = () => {
    User.create({
        firstName: 'Donald',
        lastName: 'Admin',
        login: 'admin_user',
        // password = 'password'
        password: '$2b$10$dKFTywWvF.na0yxU0HLGges0u7XaZ.M7S9mMsznAM8OqgoY/MCWHC',
        type: 'admin',
    });
}

export const initUsers = () => {
    return Promise.all([initRegularUser(), initManagerUser(), initAdminUser()]);
}