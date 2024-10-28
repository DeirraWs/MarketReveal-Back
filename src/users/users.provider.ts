import { User } from './users.model';

export const usersProvider = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
];