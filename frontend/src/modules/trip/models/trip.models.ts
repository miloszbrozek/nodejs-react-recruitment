export interface TripData {
    id?: number;
    startDate: Date;
    endDate: Date;
    destination: string;
    comment: string;
    userId: number;
}

export interface TripDataSerialized {
    id?: number;
    startDate: string;
    endDate: string;
    destination: string;
    comment: string;
    userId: number;
}