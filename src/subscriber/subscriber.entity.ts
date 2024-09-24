import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('subscribers')
export class Subscriber {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column({default: false})
    confirmed: boolean;

    @Column()
    location: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Timestamp for when the subscriber was created
    created_at: Date;

    constructor(subscriber: Partial<Subscriber>) {
        Object.assign(this, subscriber)
    }
}