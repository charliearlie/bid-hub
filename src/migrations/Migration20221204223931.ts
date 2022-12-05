import { Migration } from '@mikro-orm/migrations';

export class Migration20221204223931 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "item" add column "slug" jsonb not null;');
    this.addSql('alter table "item" add constraint "item_slug_unique" unique ("slug");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "item" drop constraint "item_slug_unique";');
    this.addSql('alter table "item" drop column "slug";');
  }

}
