import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialContentTables1740900000000
  implements MigrationInterface
{
  name = 'CreateInitialContentTables1740900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`content_articles\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`slug\` VARCHAR(180) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`summary\` TEXT NULL,
        \`excerpt\` VARCHAR(300) NULL,
        \`type\` ENUM('NEWS','REVIEW','GUIDE','COMPARISON') NOT NULL,
        \`status\` ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
        \`published_at\` DATETIME NULL,
        \`is_featured\` TINYINT NOT NULL DEFAULT 0,
        \`meta_title\` VARCHAR(255) NULL,
        \`meta_description\` VARCHAR(500) NULL,
        \`hero_image\` VARCHAR(1024) NULL,
        \`hero_image_alt\` VARCHAR(255) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_content_articles_slug\` (\`slug\`),
        INDEX \`IDX_content_articles_type_status_published_at\` (\`type\`, \`status\`, \`published_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`content_sections\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`article_id\` INT NOT NULL,
        \`heading\` VARCHAR(255) NULL,
        \`body\` TEXT NOT NULL,
        \`sort_order\` INT NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_content_sections_article\` (\`article_id\`),
        CONSTRAINT \`fk_content_sections_article\`
          FOREIGN KEY (\`article_id\`) REFERENCES \`content_articles\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`content_tags\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`article_id\` INT NOT NULL,
        \`value\` VARCHAR(120) NOT NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_content_tags_article\` (\`article_id\`),
        CONSTRAINT \`fk_content_tags_article\`
          FOREIGN KEY (\`article_id\`) REFERENCES \`content_articles\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS \`content_tags\`');
    await queryRunner.query('DROP TABLE IF EXISTS \`content_sections\`');
    await queryRunner.query('DROP TABLE IF EXISTS \`content_articles\`');
  }
}
