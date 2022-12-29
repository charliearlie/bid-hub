import { Migration } from '@mikro-orm/migrations';

export class Migration20221228195706 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "category" ("id" serial primary key, "title" varchar(255) not null, "description" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "user" ("id" serial primary key, "username" varchar(255) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "email" varchar(255) not null, "password" varchar(255) not null, "avatar_url" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_username_email_unique" unique ("username", "email");');

    this.addSql('create table "payment" ("id" serial primary key, "card_name" varchar(255) not null, "type" varchar(255) not null, "card_number" varchar(255) not null, "last_four_digits" varchar(255) not null, "billing_address" varchar(255) not null, "avatar_url" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int not null);');

    this.addSql('create table "item" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) null, "image_url" varchar(255) null, "buy_it_now_price" int null, "starting_price" int null, "winning_bid" int null, "created_at" timestamptz(0) null, "updated_at" timestamptz(0) not null, "slug" varchar(255) not null, "condition" text not null default \'New\', "seller_id" int not null);');
    this.addSql('alter table "item" add constraint "item_slug_unique" unique ("slug");');

    this.addSql('create table "item_categories" ("item_id" int not null, "category_id" int not null, constraint "item_categories_pkey" primary key ("item_id", "category_id"));');

    this.addSql('create table "bid" ("id" serial primary key, "item_id" int not null, "user_id" int not null, "amount" int not null, "status" text not null default \'pending\', "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "address" ("id" serial primary key, "user_id" int not null, "first_line" varchar(255) not null, "second_line" varchar(255) null, "third_line" varchar(255) null, "city_or_town" varchar(255) not null, "post_code" varchar(255) not null, "address_name" varchar(255) not null);');

    this.addSql('alter table "payment" add constraint "payment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "item" add constraint "item_seller_id_foreign" foreign key ("seller_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "item_categories" add constraint "item_categories_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "item_categories" add constraint "item_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "bid" add constraint "bid_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade;');
    this.addSql('alter table "bid" add constraint "bid_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "address" add constraint "address_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "item_categories" drop constraint "item_categories_category_id_foreign";');

    this.addSql('alter table "payment" drop constraint "payment_user_id_foreign";');

    this.addSql('alter table "item" drop constraint "item_seller_id_foreign";');

    this.addSql('alter table "bid" drop constraint "bid_user_id_foreign";');

    this.addSql('alter table "address" drop constraint "address_user_id_foreign";');

    this.addSql('alter table "item_categories" drop constraint "item_categories_item_id_foreign";');

    this.addSql('alter table "bid" drop constraint "bid_item_id_foreign";');

    this.addSql('drop table if exists "category" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "payment" cascade;');

    this.addSql('drop table if exists "item" cascade;');

    this.addSql('drop table if exists "item_categories" cascade;');

    this.addSql('drop table if exists "bid" cascade;');

    this.addSql('drop table if exists "address" cascade;');
  }

}
