import { Migration } from '@mikro-orm/migrations';

export class Migration20221203125436 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "username" varchar(255) not null, "email" varchar(255) not null, "avatar_url" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "item" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) null, "image_url" varchar(255) null, "price" int not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "seller_id" int not null);');

    this.addSql('alter table "item" add constraint "item_seller_id_foreign" foreign key ("seller_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "item" drop constraint "item_seller_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "item" cascade;');
  }

}
