import { Migration } from '@mikro-orm/migrations';

export class Migration20221205194509 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "item_categories" ("item_id" int not null, "category_id" int not null, constraint "item_categories_pkey" primary key ("item_id", "category_id"));');

    this.addSql('alter table "item_categories" add constraint "item_categories_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "item_categories" add constraint "item_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "item_categories" cascade;');
  }

}
