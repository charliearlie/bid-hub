import { Migration } from '@mikro-orm/migrations';

export class Migration20221212202608 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "address" ("id" serial primary key, "user_id" int not null, "first_line" varchar(255) not null, "second_line" varchar(255) null, "third_line" varchar(255) null, "city_or_town" varchar(255) not null, "post_code" varchar(255) not null, "address_name" varchar(255) not null);');

    this.addSql('alter table "address" add constraint "address_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "address" cascade;');
  }

}
