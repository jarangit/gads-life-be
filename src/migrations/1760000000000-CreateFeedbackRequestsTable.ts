import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeedbackRequestsTable1760000000000
  implements MigrationInterface
{
  name = 'CreateFeedbackRequestsTable1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`feedback_requests\` (
        \`id\` varchar(10) NOT NULL,
        \`type\` enum ('ISSUE', 'WRONG_INFORMATION', 'MORE_INFORMATION') NOT NULL,
        \`name\` varchar(120) NULL,
        \`email\` varchar(180) NULL,
        \`subject\` varchar(255) NULL,
        \`message\` text NOT NULL,
        \`page_url\` varchar(1024) NULL,
        \`status\` enum ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'NEW',
        \`admin_note\` text NULL,
        \`resolved_at\` datetime NULL,
        \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_feedback_requests_status_created_at\` (\`status\`, \`created_at\`),
        INDEX \`IDX_feedback_requests_type_created_at\` (\`type\`, \`created_at\`)
      ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `feedback_requests`');
  }
}
