import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertContentIdsToVarchar1741100000000 implements MigrationInterface {
  name = 'ConvertContentIdsToVarchar1741100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "SET @fk_sections := (SELECT kcu.CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE kcu WHERE kcu.TABLE_SCHEMA = DATABASE() AND kcu.TABLE_NAME = 'content_sections' AND kcu.COLUMN_NAME = 'article_id' AND kcu.REFERENCED_TABLE_NAME = 'content_articles' LIMIT 1)",
    );
    await queryRunner.query(
      "SET @sql_sections_drop_fk := IF(@fk_sections IS NULL, 'SELECT 1', CONCAT('ALTER TABLE `content_sections` DROP FOREIGN KEY `', @fk_sections, '`'))",
    );
    await queryRunner.query(
      'PREPARE stmt_sections_drop_fk FROM @sql_sections_drop_fk',
    );
    await queryRunner.query('EXECUTE stmt_sections_drop_fk');
    await queryRunner.query('DEALLOCATE PREPARE stmt_sections_drop_fk');

    await queryRunner.query(
      "SET @fk_tags := (SELECT kcu.CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE kcu WHERE kcu.TABLE_SCHEMA = DATABASE() AND kcu.TABLE_NAME = 'content_tags' AND kcu.COLUMN_NAME = 'article_id' AND kcu.REFERENCED_TABLE_NAME = 'content_articles' LIMIT 1)",
    );
    await queryRunner.query(
      "SET @sql_tags_drop_fk := IF(@fk_tags IS NULL, 'SELECT 1', CONCAT('ALTER TABLE `content_tags` DROP FOREIGN KEY `', @fk_tags, '`'))",
    );
    await queryRunner.query('PREPARE stmt_tags_drop_fk FROM @sql_tags_drop_fk');
    await queryRunner.query('EXECUTE stmt_tags_drop_fk');
    await queryRunner.query('DEALLOCATE PREPARE stmt_tags_drop_fk');

    await queryRunner.query(
      'ALTER TABLE `content_articles` MODIFY COLUMN `id` VARCHAR(10) NOT NULL',
    );

    const sectionsIdColumn = await queryRunner.query(
      "SHOW COLUMNS FROM `content_sections` LIKE 'id'",
    );

    if (!sectionsIdColumn.length) {
      await queryRunner.query(
        'ALTER TABLE `content_sections` ADD COLUMN `id` VARCHAR(10) NULL',
      );
      await queryRunner.query(
        "UPDATE `content_sections` SET `id` = LEFT(REPLACE(UUID(), '-', ''), 10) WHERE `id` IS NULL OR `id` = ''",
      );

      const sectionsPrimaryKey = await queryRunner.query(
        "SHOW INDEX FROM `content_sections` WHERE Key_name = 'PRIMARY'",
      );
      if (sectionsPrimaryKey.length) {
        await queryRunner.query(
          'ALTER TABLE `content_sections` DROP PRIMARY KEY',
        );
      }

      await queryRunner.query(
        'ALTER TABLE `content_sections` MODIFY COLUMN `id` VARCHAR(10) NOT NULL, ADD PRIMARY KEY (`id`)',
      );
    } else {
      await queryRunner.query(
        'ALTER TABLE `content_sections` MODIFY COLUMN `id` VARCHAR(10) NOT NULL',
      );
    }

    await queryRunner.query(
      'ALTER TABLE `content_sections` MODIFY COLUMN `article_id` VARCHAR(10) NOT NULL',
    );

    await queryRunner.query(
      'ALTER TABLE `content_tags` MODIFY COLUMN `id` VARCHAR(10) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `content_tags` MODIFY COLUMN `article_id` VARCHAR(10) NOT NULL',
    );

    await queryRunner.query(
      'ALTER TABLE `content_sections` ADD CONSTRAINT `fk_content_sections_article` FOREIGN KEY (`article_id`) REFERENCES `content_articles`(`id`) ON DELETE CASCADE',
    );

    await queryRunner.query(
      'ALTER TABLE `content_tags` ADD CONSTRAINT `fk_content_tags_article` FOREIGN KEY (`article_id`) REFERENCES `content_articles`(`id`) ON DELETE CASCADE',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "SET @fk_sections := (SELECT kcu.CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE kcu WHERE kcu.TABLE_SCHEMA = DATABASE() AND kcu.TABLE_NAME = 'content_sections' AND kcu.COLUMN_NAME = 'article_id' AND kcu.REFERENCED_TABLE_NAME = 'content_articles' LIMIT 1)",
    );
    await queryRunner.query(
      "SET @sql_sections_drop_fk := IF(@fk_sections IS NULL, 'SELECT 1', CONCAT('ALTER TABLE `content_sections` DROP FOREIGN KEY `', @fk_sections, '`'))",
    );
    await queryRunner.query(
      'PREPARE stmt_sections_drop_fk FROM @sql_sections_drop_fk',
    );
    await queryRunner.query('EXECUTE stmt_sections_drop_fk');
    await queryRunner.query('DEALLOCATE PREPARE stmt_sections_drop_fk');

    await queryRunner.query(
      "SET @fk_tags := (SELECT kcu.CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE kcu WHERE kcu.TABLE_SCHEMA = DATABASE() AND kcu.TABLE_NAME = 'content_tags' AND kcu.COLUMN_NAME = 'article_id' AND kcu.REFERENCED_TABLE_NAME = 'content_articles' LIMIT 1)",
    );
    await queryRunner.query(
      "SET @sql_tags_drop_fk := IF(@fk_tags IS NULL, 'SELECT 1', CONCAT('ALTER TABLE `content_tags` DROP FOREIGN KEY `', @fk_tags, '`'))",
    );
    await queryRunner.query('PREPARE stmt_tags_drop_fk FROM @sql_tags_drop_fk');
    await queryRunner.query('EXECUTE stmt_tags_drop_fk');
    await queryRunner.query('DEALLOCATE PREPARE stmt_tags_drop_fk');

    await queryRunner.query(
      'ALTER TABLE `content_tags` MODIFY COLUMN `article_id` INT NOT NULL, MODIFY COLUMN `id` INT NOT NULL',
    );

    const sectionsIdColumn = await queryRunner.query(
      "SHOW COLUMNS FROM `content_sections` LIKE 'id'",
    );
    if (sectionsIdColumn.length) {
      await queryRunner.query(
        'ALTER TABLE `content_sections` MODIFY COLUMN `id` INT NOT NULL',
      );
    }

    await queryRunner.query(
      'ALTER TABLE `content_sections` MODIFY COLUMN `article_id` INT NOT NULL',
    );

    await queryRunner.query(
      'ALTER TABLE `content_articles` MODIFY COLUMN `id` INT NOT NULL',
    );
  }
}
