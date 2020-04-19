import { User } from 'app/db/models/User';
import { TripAttributes, Trip } from '../models/Trip';

export class TripDao {

    defOrder = [['id', 'ASC']] as any;

    async findById(id: number) {
        const trip = await Trip.findByPk(id, {order: this.defOrder});
        return this.instanceToAttributesObject(trip);
    }

    async getUserTrips(userId: number) {
        const trips = await Trip.findAll({
            where: {
                userId: userId
            },
            order: this.defOrder
        });
        return trips.map(this.instanceToAttributesObject);
    }

    async addTrip(trip: TripAttributes) {
        return Trip.create(trip);
    }

    async deleteTrip(id: number) {
        return Trip.destroy({
            where: {
                id: id
            }
        }).then(result => result > 0);
    }

    async updateTrip(trip: TripAttributes) {
        return Trip.update(trip, {
            where: {id: trip.id},
            fields: Object.keys(trip)
        }).then(result => result[0] > 0);
    }

    private instanceToAttributesObject(model: any): TripAttributes {
        if(!model) {
            return null;
        }
        const { id, userId, startDate, endDate, destination, comment } = model;
        return {
            id, userId, startDate, endDate, destination, comment
        };
    }

}