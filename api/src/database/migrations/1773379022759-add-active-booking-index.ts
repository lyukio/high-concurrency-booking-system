import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActiveBookingIndex1773379022759 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE UNIQUE INDEX unique_active_booking
            ON booking (seat_id)
            WHERE deleted_at IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX unique_active_booking
        `);
    }

}
