import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIndexForContentTags1741000000000
  implements MigrationInterface
{
  name = 'AddUniqueIndexForContentTags1741000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE \`content_tags\` SET \`value\` = TRIM(\`value\`)`);

    await queryRunner.query(`DELETE FROM \`content_tags\` WHERE \`value\` = ''`);

    await queryRunner.query(`
      DELETE ct1
      FROM \`content_tags\` ct1
      INNER JOIN \`content_tags\` ct2
        ON ct1.\`article_id\` = ct2.\`article_id\`
        AND LOWER(TRIM(ct1.\`value\`)) = LOWER(TRIM(ct2.\`value\`))
        AND ct1.\`id\` > ct2.\`id\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`content_tags\`
      ADD UNIQUE INDEX \`ux_content_tags_article_value\` (\`article_id\`, \`value\`)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`content_tags\`
      DROP INDEX \`ux_content_tags_article_value\`
    `);
  }
}
