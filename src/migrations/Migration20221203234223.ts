import { Migration } from '@mikro-orm/migrations';

export class Migration20221203234223 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add constraint "user_username_email_unique" unique ("username", "email");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_username_email_unique";');
  }

}
