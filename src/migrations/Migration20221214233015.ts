import { Migration } from '@mikro-orm/migrations';

export class Migration20221214233015 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_categories" ("user_id" int not null, "category_id" int not null, constraint "user_categories_pkey" primary key ("user_id", "category_id"));');

    this.addSql('alter table "user_categories" add constraint "user_categories_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_categories" add constraint "user_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "category" add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_categories" cascade;');

    this.addSql('alter table "category" drop column "created_at";');
    this.addSql('alter table "category" drop column "updated_at";');
  }

}
