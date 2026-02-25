import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContentTags1772039547663 implements MigrationInterface {
    name = 'AddContentTags1772039547663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`content_sections\` DROP FOREIGN KEY \`fk_content_sections_article\``);
        await queryRunner.query(`ALTER TABLE \`content_tags\` DROP FOREIGN KEY \`fk_content_tags_article\``);
        await queryRunner.query(`DROP INDEX \`idx_content_sections_article\` ON \`content_sections\``);
        await queryRunner.query(`DROP INDEX \`IDX_content_articles_slug\` ON \`content_articles\``);
        await queryRunner.query(`DROP INDEX \`IDX_content_articles_type_status_published_at\` ON \`content_articles\``);
        await queryRunner.query(`DROP INDEX \`idx_content_tags_article\` ON \`content_tags\``);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`is_active\` \`is_active\` tinyint(1) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`content_articles\` CHANGE \`slug\` \`slug\` varchar(180) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`content_articles\` ADD UNIQUE INDEX \`IDX_85e8fffbde73167dd1406ed477\` (\`slug\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_ca0d88926c955d176941346d92\` ON \`content_articles\` (\`type\`, \`status\`, \`published_at\`)`);
        await queryRunner.query(`ALTER TABLE \`content_sections\` ADD CONSTRAINT \`FK_c434093da8501f15b4a78bbbed4\` FOREIGN KEY (\`article_id\`) REFERENCES \`content_articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`content_tags\` ADD CONSTRAINT \`FK_ff55f6bb4c658334c02d81528d0\` FOREIGN KEY (\`article_id\`) REFERENCES \`content_articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`content_tags\` DROP FOREIGN KEY \`FK_ff55f6bb4c658334c02d81528d0\``);
        await queryRunner.query(`ALTER TABLE \`content_sections\` DROP FOREIGN KEY \`FK_c434093da8501f15b4a78bbbed4\``);
        await queryRunner.query(`DROP INDEX \`IDX_ca0d88926c955d176941346d92\` ON \`content_articles\``);
        await queryRunner.query(`ALTER TABLE \`content_articles\` DROP INDEX \`IDX_85e8fffbde73167dd1406ed477\``);
        await queryRunner.query(`ALTER TABLE \`content_articles\` CHANGE \`slug\` \`slug\` varchar(180) COLLATE "utf8mb4_unicode_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`is_active\` \`is_active\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`CREATE INDEX \`idx_content_tags_article\` ON \`content_tags\` (\`article_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_content_articles_type_status_published_at\` ON \`content_articles\` (\`type\`, \`status\`, \`published_at\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_content_articles_slug\` ON \`content_articles\` (\`slug\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_content_sections_article\` ON \`content_sections\` (\`article_id\`)`);
        await queryRunner.query(`ALTER TABLE \`content_tags\` ADD CONSTRAINT \`fk_content_tags_article\` FOREIGN KEY (\`article_id\`) REFERENCES \`content_articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`content_sections\` ADD CONSTRAINT \`fk_content_sections_article\` FOREIGN KEY (\`article_id\`) REFERENCES \`content_articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
