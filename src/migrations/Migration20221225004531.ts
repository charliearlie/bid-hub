import { Migration } from '@mikro-orm/migrations';

export class Migration20221225004531 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bid" ("id" serial primary key, "item_id" int not null, "user_id" int not null, "amount" int not null, "status" text not null default \'pending\', "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('alter table "bid" add constraint "bid_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade;');
    this.addSql('alter table "bid" add constraint "bid_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "bid" cascade;');
  }

}
