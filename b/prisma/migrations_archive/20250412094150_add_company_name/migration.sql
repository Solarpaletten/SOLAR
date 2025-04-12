-- AlterTable
ALTER TABLE "companies" ADD COLUMN "name" VARCHAR(100);

-- UpdateTable: Установка значения name на основе code для существующих записей
UPDATE "companies" SET "name" = code WHERE "name" IS NULL;

-- AlterTable: Установка NOT NULL ограничения после обновления данных
ALTER TABLE "companies" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "companies"("name");
