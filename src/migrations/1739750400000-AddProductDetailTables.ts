import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates normalized product-detail tables.
 * Does NOT modify existing tables.
 */
export class AddProductDetailTables1739750400000
  implements MigrationInterface
{
  name = 'AddProductDetailTables1739750400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── product_key_highlights ──
    await queryRunner.query(`
      CREATE TABLE \`product_key_highlights\` (
        \`id\`         INT          NOT NULL AUTO_INCREMENT,
        \`product_id\` VARCHAR(10)  NOT NULL,
        \`content\`    TEXT         NOT NULL,
        \`sort_order\` INT          NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_key_highlights_product\` (\`product_id\`),
        CONSTRAINT \`fk_key_highlights_product\`
          FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ── product_weaknesses ──
    await queryRunner.query(`
      CREATE TABLE \`product_weaknesses\` (
        \`id\`         INT          NOT NULL AUTO_INCREMENT,
        \`product_id\` VARCHAR(10)  NOT NULL,
        \`content\`    TEXT         NOT NULL,
        \`sort_order\` INT          NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_weaknesses_product\` (\`product_id\`),
        CONSTRAINT \`fk_weaknesses_product\`
          FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ── product_before_purchase_points ──
    await queryRunner.query(`
      CREATE TABLE \`product_before_purchase_points\` (
        \`id\`         INT          NOT NULL AUTO_INCREMENT,
        \`product_id\` VARCHAR(10)  NOT NULL,
        \`content\`    TEXT         NOT NULL,
        \`sort_order\` INT          NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_before_purchase_product\` (\`product_id\`),
        CONSTRAINT \`fk_before_purchase_product\`
          FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ── product_after_usage_points ──
    await queryRunner.query(`
      CREATE TABLE \`product_after_usage_points\` (
        \`id\`         INT          NOT NULL AUTO_INCREMENT,
        \`product_id\` VARCHAR(10)  NOT NULL,
        \`content\`    TEXT         NOT NULL,
        \`sort_order\` INT          NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_after_usage_product\` (\`product_id\`),
        CONSTRAINT \`fk_after_usage_product\`
          FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ── product_pros ──
    await queryRunner.query(`
      CREATE TABLE \`product_pros\` (
        \`id\`         INT          NOT NULL AUTO_INCREMENT,
        \`product_id\` VARCHAR(10)  NOT NULL,
        \`content\`    TEXT         NOT NULL,
        \`sort_order\` INT          NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_pros_product\` (\`product_id\`),
        CONSTRAINT \`fk_pros_product\`
          FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ── product_cons ──
    await queryRunner.query(`
      CREATE TABLE \`product_cons\` (
        \`id\`         INT          NOT NULL AUTO_INCREMENT,
        \`product_id\` VARCHAR(10)  NOT NULL,
        \`content\`    TEXT         NOT NULL,
        \`sort_order\` INT          NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_cons_product\` (\`product_id\`),
        CONSTRAINT \`fk_cons_product\`
          FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ── product_quick_verdicts (1:1) ──
    await queryRunner.query(`
      CREATE TABLE \`product_quick_verdicts\` (
        \`id\`          INT           NOT NULL AUTO_INCREMENT,
        \`product_id\`  VARCHAR(10)   NOT NULL,
        \`quote\`       VARCHAR(255)  NOT NULL,
        \`description\` TEXT          NOT NULL,
        \`created_at\`  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\`  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_quick_verdicts_product\` (\`product_id\`),
        CONSTRAINT \`fk_quick_verdicts_product\`
          FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ── product_quick_verdict_tags ──
    await queryRunner.query(`
      CREATE TABLE \`product_quick_verdict_tags\` (
        \`id\`         INT           NOT NULL AUTO_INCREMENT,
        \`product_id\` VARCHAR(10)   NOT NULL,
        \`tag\`        VARCHAR(120)  NOT NULL,
        \`sort_order\` INT           NOT NULL DEFAULT 0,
        \`created_at\` DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_verdict_tags_product\` (\`product_id\`),
        INDEX \`idx_verdict_tags_tag\` (\`tag\`),
        CONSTRAINT \`fk_verdict_tags_product\`
          FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ── product_pricing (1:1) ──
    await queryRunner.query(`
      CREATE TABLE \`product_pricing\` (
        \`id\`          INT           NOT NULL AUTO_INCREMENT,
        \`product_id\`  VARCHAR(10)   NOT NULL,
        \`price\`       INT           NOT NULL,
        \`currency\`    VARCHAR(10)   NOT NULL DEFAULT 'THB',
        \`price_label\` VARCHAR(255)  NOT NULL,
        \`created_at\`  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\`  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`idx_pricing_product\` (\`product_id\`),
        CONSTRAINT \`fk_pricing_product\`
          FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_pricing\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_quick_verdict_tags\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_quick_verdicts\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_cons\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_pros\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_after_usage_points\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_before_purchase_points\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_weaknesses\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`product_key_highlights\``);
  }
}
