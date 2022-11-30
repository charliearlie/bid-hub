import { Migration } from '@mikro-orm/migrations';

export class Migration20221127235242 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "item" ("id" serial primary key, "title" varchar(255) not null, "description" varchar(255) not null, "image_url" varchar(255) not null, "price" int not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "item" cascade;');
  }

}
