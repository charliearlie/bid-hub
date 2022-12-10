import { Migration } from '@mikro-orm/migrations';

export class Migration20221210161140 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "item" add column "starting_price" int null, add column "winning_bid" int null, add column "condition" text not null default \'New\';');
    this.addSql('alter table "item" rename column "price" to "buy_it_now_price";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "item" drop column "starting_price";');
    this.addSql('alter table "item" drop column "winning_bid";');
    this.addSql('alter table "item" drop column "condition";');
    this.addSql('alter table "item" rename column "buy_it_now_price" to "price";');
  }

}
