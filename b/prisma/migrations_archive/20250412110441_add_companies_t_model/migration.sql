/*
  Warnings:

  - You are about to drop the `assistant_preferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bank_operations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chart_of_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversation_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversation_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doc_settlement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `translation_cache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assistant_preferences" DROP CONSTRAINT "assistant_preferences_user_id_fkey";

-- DropForeignKey
ALTER TABLE "bank_operations" DROP CONSTRAINT "bank_operations_client_id_fkey";

-- DropForeignKey
ALTER TABLE "bank_operations" DROP CONSTRAINT "bank_operations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "chart_of_accounts" DROP CONSTRAINT "chart_of_accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_user_id_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_messages" DROP CONSTRAINT "conversation_messages_session_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_sessions" DROP CONSTRAINT "conversation_sessions_client_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_sessions" DROP CONSTRAINT "conversation_sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "doc_settlement" DROP CONSTRAINT "doc_settlement_client_id_fkey";

-- DropForeignKey
ALTER TABLE "doc_settlement" DROP CONSTRAINT "doc_settlement_user_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_user_id_fkey";

-- DropForeignKey
ALTER TABLE "purchase_items" DROP CONSTRAINT "purchase_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "purchase_items" DROP CONSTRAINT "purchase_items_purchase_id_fkey";

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_client_id_fkey";

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_user_id_fkey";

-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_client_id_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_warehouse_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_client_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_responsible_person_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_user_id_fkey";

-- DropTable
DROP TABLE "assistant_preferences";

-- DropTable
DROP TABLE "bank_operations";

-- DropTable
DROP TABLE "chart_of_accounts";

-- DropTable
DROP TABLE "clients";

-- DropTable
DROP TABLE "companies";

-- DropTable
DROP TABLE "conversation_messages";

-- DropTable
DROP TABLE "conversation_sessions";

-- DropTable
DROP TABLE "doc_settlement";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "purchase_items";

-- DropTable
DROP TABLE "purchases";

-- DropTable
DROP TABLE "sales";

-- DropTable
DROP TABLE "translation_cache";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "warehouses";

-- DropEnum
DROP TYPE "ConversationStatus";

-- DropEnum
DROP TYPE "Language";

-- DropEnum
DROP TYPE "MessageType";

-- CreateTable
CREATE TABLE "usersT" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'active',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "token_expires" TIMESTAMP(3),
    "reset_token" TEXT,
    "reset_token_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usersT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientsT" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "role" "ClientRole" NOT NULL DEFAULT 'CLIENT',
    "is_active" BOOLEAN DEFAULT true,
    "code" VARCHAR(50),
    "vat_code" VARCHAR(50),
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientsT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salesT" (
    "id" SERIAL NOT NULL,
    "doc_number" VARCHAR(50) NOT NULL,
    "doc_date" DATE NOT NULL,
    "sale_date" DATE,
    "user_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "currency" "currency" NOT NULL DEFAULT 'EUR',
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "invoice_type" VARCHAR(50),
    "invoice_number" VARCHAR(50) NOT NULL,
    "vat_rate" DECIMAL(5,2),

    CONSTRAINT "salesT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasesT" (
    "id" SERIAL NOT NULL,
    "doc_number" VARCHAR(50) NOT NULL,
    "doc_date" DATE NOT NULL,
    "purchase_date" DATE,
    "user_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "currency" "currency" NOT NULL DEFAULT 'EUR',
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "invoice_type" VARCHAR(50),
    "invoice_number" VARCHAR(50) NOT NULL,
    "vat_rate" DECIMAL(5,2),

    CONSTRAINT "purchasesT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehousesT" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50),
    "address" VARCHAR(255),
    "status" "warehouse_status" NOT NULL DEFAULT 'Active',
    "client_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "responsible_person_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehousesT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_operationsT" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "account_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_operationsT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productsT" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "unit" VARCHAR(20) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" "currency" NOT NULL DEFAULT 'EUR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productsT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chart_of_accountsT" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "account_type" VARCHAR(50) NOT NULL,
    "parent_code" VARCHAR(20),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chart_of_accountsT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_settlementT" (
    "id" SERIAL NOT NULL,
    "doc_number" VARCHAR(50) NOT NULL,
    "doc_date" DATE NOT NULL,
    "client_id" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "doc_settlementT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companiesT" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "director_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "setup_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companiesT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usersT_email_key" ON "usersT"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usersT_reset_token_key" ON "usersT"("reset_token");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "usersT"("email");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "usersT"("role");

-- CreateIndex
CREATE INDEX "clientsT_created_at_idx" ON "clientsT"("created_at");

-- CreateIndex
CREATE INDEX "clientsT_role_idx" ON "clientsT"("role");

-- CreateIndex
CREATE INDEX "clientsT_is_active_idx" ON "clientsT"("is_active");

-- CreateIndex
CREATE INDEX "salesT_doc_date_idx" ON "salesT"("doc_date");

-- CreateIndex
CREATE INDEX "salesT_client_id_idx" ON "salesT"("client_id");

-- CreateIndex
CREATE INDEX "salesT_warehouse_id_idx" ON "salesT"("warehouse_id");

-- CreateIndex
CREATE INDEX "salesT_status_idx" ON "salesT"("status");

-- CreateIndex
CREATE INDEX "purchasesT_doc_date_idx" ON "purchasesT"("doc_date");

-- CreateIndex
CREATE INDEX "purchasesT_client_id_idx" ON "purchasesT"("client_id");

-- CreateIndex
CREATE INDEX "purchasesT_warehouse_id_idx" ON "purchasesT"("warehouse_id");

-- CreateIndex
CREATE INDEX "purchasesT_status_idx" ON "purchasesT"("status");

-- CreateIndex
CREATE INDEX "warehousesT_status_idx" ON "warehousesT"("status");

-- CreateIndex
CREATE INDEX "warehousesT_client_id_idx" ON "warehousesT"("client_id");

-- CreateIndex
CREATE INDEX "bank_operationsT_date_idx" ON "bank_operationsT"("date");

-- CreateIndex
CREATE INDEX "bank_operationsT_type_idx" ON "bank_operationsT"("type");

-- CreateIndex
CREATE INDEX "productsT_code_idx" ON "productsT"("code");

-- CreateIndex
CREATE INDEX "productsT_is_active_idx" ON "productsT"("is_active");

-- CreateIndex
CREATE INDEX "chart_of_accountsT_code_idx" ON "chart_of_accountsT"("code");

-- CreateIndex
CREATE INDEX "chart_of_accountsT_type_idx" ON "chart_of_accountsT"("type");

-- CreateIndex
CREATE INDEX "chart_of_accountsT_is_active_idx" ON "chart_of_accountsT"("is_active");

-- CreateIndex
CREATE INDEX "doc_settlementT_doc_date_idx" ON "doc_settlementT"("doc_date");

-- CreateIndex
CREATE INDEX "doc_settlementT_client_id_idx" ON "doc_settlementT"("client_id");

-- CreateIndex
CREATE INDEX "doc_settlementT_status_idx" ON "doc_settlementT"("status");

-- CreateIndex
CREATE UNIQUE INDEX "companiesT_code_key" ON "companiesT"("code");

-- CreateIndex
CREATE INDEX "companiesT_user_id_idx" ON "companiesT"("user_id");

-- CreateIndex
CREATE INDEX "companiesT_name_idx" ON "companiesT"("name");

-- AddForeignKey
ALTER TABLE "clientsT" ADD CONSTRAINT "clientsT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salesT" ADD CONSTRAINT "salesT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salesT" ADD CONSTRAINT "salesT_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientsT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salesT" ADD CONSTRAINT "salesT_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehousesT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasesT" ADD CONSTRAINT "purchasesT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasesT" ADD CONSTRAINT "purchasesT_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientsT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchasesT" ADD CONSTRAINT "purchasesT_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehousesT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehousesT" ADD CONSTRAINT "warehousesT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehousesT" ADD CONSTRAINT "warehousesT_responsible_person_id_fkey" FOREIGN KEY ("responsible_person_id") REFERENCES "usersT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehousesT" ADD CONSTRAINT "warehousesT_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientsT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_operationsT" ADD CONSTRAINT "bank_operationsT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_operationsT" ADD CONSTRAINT "bank_operationsT_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientsT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productsT" ADD CONSTRAINT "productsT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_of_accountsT" ADD CONSTRAINT "chart_of_accountsT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_settlementT" ADD CONSTRAINT "doc_settlementT_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientsT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_settlementT" ADD CONSTRAINT "doc_settlementT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companiesT" ADD CONSTRAINT "companiesT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usersT"("id") ON DELETE CASCADE ON UPDATE CASCADE;
