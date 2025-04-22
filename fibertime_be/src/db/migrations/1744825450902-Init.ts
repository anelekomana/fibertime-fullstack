import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1744825450902 implements MigrationInterface {
  name = 'Init1744825450902';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "bundle" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NULL,
          "expirationDate" TIMESTAMP NOT NULL,
          CONSTRAINT "PK_637e3f87e837d6532109c198dea" PRIMARY KEY ("id")
        )
      `);
    await queryRunner.query(`
        CREATE TABLE "pairing_code" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "code" character varying(4) NOT NULL,
          "expiresAt" TIMESTAMP NOT NULL,
          "status" character varying NOT NULL DEFAULT 'active',
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "UQ_57b37422060287f31e98a503a5f" UNIQUE ("code"),
          CONSTRAINT "PK_f75ee5d8b8617191ba17183c16b" PRIMARY KEY ("id")
        )
      `);
    await queryRunner.query(`
        CREATE TABLE "device" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "macAddress" character varying NOT NULL,
          "status" character varying NOT NULL DEFAULT 'disconnected',
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "userId" uuid,
          "bundleId" uuid,
          "pairingCodeId" uuid,
          CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id")
        )
      `);
    await queryRunner.query(`
        CREATE TABLE "user" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "phoneNumber" character varying NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "role" character varying NOT NULL DEFAULT 'user',
          CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"),
          CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )
      `);
    await queryRunner.query(`
        CREATE TABLE "otp" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "phoneNumber" character varying NOT NULL,
          "otp" character varying NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "status" character varying NOT NULL DEFAULT 'pending',
          "expiresAt" TIMESTAMP NOT NULL,
          CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id")
        )
      `);
    await queryRunner.query(`
        ALTER TABLE "device"
        ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"
        FOREIGN KEY ("userId") REFERENCES "user"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
        ALTER TABLE "device"
        ADD CONSTRAINT "FK_a6309dea82b92cc79400f005ead"
        FOREIGN KEY ("bundleId") REFERENCES "bundle"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
    await queryRunner.query(`
        ALTER TABLE "device"
        ADD CONSTRAINT "FK_f284a6c5afd55ef8699566c3005"
        FOREIGN KEY ("pairingCodeId") REFERENCES "pairing_code"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_f284a6c5afd55ef8699566c3005"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_a6309dea82b92cc79400f005ead"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`,
    );
    await queryRunner.query(`DROP TABLE "otp"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "device"`);
    await queryRunner.query(`DROP TABLE "pairing_code"`);
    await queryRunner.query(`DROP TABLE "bundle"`);
  }
}
