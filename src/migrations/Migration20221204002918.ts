import { Migration } from '@mikro-orm/migrations';

export class Migration20221204002918 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "item" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "item" alter column "created_at" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "item" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "item" alter column "created_at" set not null;');
  }

}
