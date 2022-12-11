import { Migration } from '@mikro-orm/migrations';

export class Migration20221211124121 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "item" alter column "buy_it_now_price" type int using ("buy_it_now_price"::int);');
    this.addSql('alter table "item" alter column "buy_it_now_price" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "item" alter column "buy_it_now_price" type int using ("buy_it_now_price"::int);');
    this.addSql('alter table "item" alter column "buy_it_now_price" set not null;');
  }

}
