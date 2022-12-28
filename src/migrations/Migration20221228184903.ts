import { Migration } from '@mikro-orm/migrations';

export class Migration20221228184903 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "payment" ("id" serial primary key, "card_name" varchar(255) not null, "type" varchar(255) not null, "card_number" varchar(255) not null, "last_four_digits" varchar(255) not null, "billing_address" varchar(255) not null, "avatar_url" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int not null);');

    this.addSql('alter table "payment" add constraint "payment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user" add column "first_name" varchar(255) not null, add column "last_name" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "payment" cascade;');

    this.addSql('alter table "user" drop column "first_name";');
    this.addSql('alter table "user" drop column "last_name";');
  }

}
