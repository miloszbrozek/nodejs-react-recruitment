import { User, UserAttributes } from 'app/db/models/User';

export class UserDao {

    private defOrder = [['login', 'ASC']] as any;

    async findUserByLogin(login: string) {
        const user = await User.findOne({
            where: {
                login: login
            },
            order: this.defOrder
        });
        return this.instanceToAttributesObject(user);
    }

    async findUserById(userId: number) {
        return User.findByPk(userId, {order: this.defOrder}).then(this.instanceToAttributesObject);
    }

    async findAllUsers() {
        return User.findAll({order: this.defOrder}).map(user => this.instanceToAttributesObject(user));
    }

    async createUser(user: UserAttributes) {
        return User.build(user).save().then(userData => this.instanceToAttributesObject(userData));
    }

    updateUser(user: UserAttributes, keepPassword: boolean) {
        const {password, ...otherFields} = user;
        const updateFields = keepPassword ? Object.keys(otherFields) : Object.keys(user);
        return User.update(user, {
            where: {id: user.id},
            fields: updateFields
        }).then(result => result[0] > 0);
    }

    deleteUser(userId: number) {
        return User.destroy({
            where: {id: userId}
        }).then(result => result > 0);
    }

    private instanceToAttributesObject(model: any): UserAttributes {
        if(!model) {
            return null;
        }
        const {firstName, lastName, login, type, password, id } = model;
        return {
            firstName, lastName, login, type, password, id
        };
    }

}