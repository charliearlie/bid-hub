import { Migration } from '@mikro-orm/migrations';

export class Migration20230115211534 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_review" ("id" serial primary key, "reviewed_user_id" int not null, "reviewer_id" int not null, "feedback" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('alter table "user_review" add constraint "user_review_reviewed_user_id_foreign" foreign key ("reviewed_user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "user_review" add constraint "user_review_reviewer_id_foreign" foreign key ("reviewer_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user" add column "active" varchar(255) null default \'true\', add column "feedback_score" int null default 0;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user_review" cascade;');

    this.addSql('alter table "user" drop column "active";');
    this.addSql('alter table "user" drop column "feedback_score";');
  }

}
