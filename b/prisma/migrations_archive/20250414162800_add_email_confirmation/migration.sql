-- Добавление поля emailConfirmationToken в таблицу users
-- (если нужно, но в нашем случае уже есть verification_token)

-- Обновить модель компаний, добавив field isEmailConfirmed
ALTER TABLE "companies" ADD COLUMN "is_email_confirmed" BOOLEAN NOT NULL DEFAULT false;

-- Индекс для быстрого поиска неподтвержденных компаний
CREATE INDEX "companies_is_email_confirmed_idx" ON "companies"("is_email_confirmed");