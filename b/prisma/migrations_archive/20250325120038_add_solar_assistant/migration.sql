-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ClientRole" AS ENUM ('CLIENT', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "currency" AS ENUM ('EUR', 'USD');

-- CreateEnum
CREATE TYPE "warehouse_status" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'AUDIO', 'TRANSLATED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'RUSSIAN', 'GERMAN', 'POLISH');

-- CreateTable
CREATE TABLE "users" (
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

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
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

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
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

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
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

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
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

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_items" (
    "id" SERIAL NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
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

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_operations" (
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

    CONSTRAINT "bank_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chart_of_accounts" (
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

    CONSTRAINT "chart_of_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_settlement" (
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

    CONSTRAINT "doc_settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_sessions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "primary_language" "Language" NOT NULL,
    "secondary_language" "Language" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "client_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "conversation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_messages" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "sender_type" VARCHAR(20) NOT NULL,
    "message_type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "original_content" TEXT NOT NULL,
    "translated_content" TEXT,
    "source_language" "Language" NOT NULL,
    "target_language" "Language" NOT NULL,
    "audio_file_path" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assistant_preferences" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "default_language" "Language" NOT NULL DEFAULT 'ENGLISH',
    "voice_enabled" BOOLEAN NOT NULL DEFAULT true,
    "translation_enabled" BOOLEAN NOT NULL DEFAULT true,
    "assistant_theme" VARCHAR(50),
    "auto_transcribe" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "assistant_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translation_cache" (
    "id" SERIAL NOT NULL,
    "original_text" TEXT NOT NULL,
    "translated_text" TEXT NOT NULL,
    "source_language" "Language" NOT NULL,
    "target_language" "Language" NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 1,
    "last_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "translation_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_token_key" ON "users"("reset_token");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- CreateIndex
CREATE INDEX "clients_created_at_idx" ON "clients"("created_at");

-- CreateIndex
CREATE INDEX "clients_role_idx" ON "clients"("role");

-- CreateIndex
CREATE INDEX "clients_is_active_idx" ON "clients"("is_active");

-- CreateIndex
CREATE INDEX "products_code_idx" ON "products"("code");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE INDEX "sales_doc_date_idx" ON "sales"("doc_date");

-- CreateIndex
CREATE INDEX "sales_client_id_idx" ON "sales"("client_id");

-- CreateIndex
CREATE INDEX "sales_warehouse_id_idx" ON "sales"("warehouse_id");

-- CreateIndex
CREATE INDEX "sales_status_idx" ON "sales"("status");

-- CreateIndex
CREATE INDEX "purchases_doc_date_idx" ON "purchases"("doc_date");

-- CreateIndex
CREATE INDEX "purchases_client_id_idx" ON "purchases"("client_id");

-- CreateIndex
CREATE INDEX "purchases_warehouse_id_idx" ON "purchases"("warehouse_id");

-- CreateIndex
CREATE INDEX "purchases_status_idx" ON "purchases"("status");

-- CreateIndex
CREATE INDEX "purchase_items_purchase_id_idx" ON "purchase_items"("purchase_id");

-- CreateIndex
CREATE INDEX "purchase_items_product_id_idx" ON "purchase_items"("product_id");

-- CreateIndex
CREATE INDEX "warehouses_status_idx" ON "warehouses"("status");

-- CreateIndex
CREATE INDEX "warehouses_client_id_idx" ON "warehouses"("client_id");

-- CreateIndex
CREATE INDEX "bank_operations_date_idx" ON "bank_operations"("date");

-- CreateIndex
CREATE INDEX "bank_operations_type_idx" ON "bank_operations"("type");

-- CreateIndex
CREATE INDEX "chart_of_accounts_code_idx" ON "chart_of_accounts"("code");

-- CreateIndex
CREATE INDEX "chart_of_accounts_type_idx" ON "chart_of_accounts"("type");

-- CreateIndex
CREATE INDEX "chart_of_accounts_is_active_idx" ON "chart_of_accounts"("is_active");

-- CreateIndex
CREATE INDEX "doc_settlement_doc_date_idx" ON "doc_settlement"("doc_date");

-- CreateIndex
CREATE INDEX "doc_settlement_client_id_idx" ON "doc_settlement"("client_id");

-- CreateIndex
CREATE INDEX "doc_settlement_status_idx" ON "doc_settlement"("status");

-- CreateIndex
CREATE INDEX "conversation_sessions_user_id_idx" ON "conversation_sessions"("user_id");

-- CreateIndex
CREATE INDEX "conversation_sessions_client_id_idx" ON "conversation_sessions"("client_id");

-- CreateIndex
CREATE INDEX "conversation_sessions_status_idx" ON "conversation_sessions"("status");

-- CreateIndex
CREATE INDEX "conversation_messages_session_id_idx" ON "conversation_messages"("session_id");

-- CreateIndex
CREATE INDEX "conversation_messages_message_type_idx" ON "conversation_messages"("message_type");

-- CreateIndex
CREATE UNIQUE INDEX "assistant_preferences_user_id_key" ON "assistant_preferences"("user_id");

-- CreateIndex
CREATE INDEX "translation_cache_source_language_target_language_idx" ON "translation_cache"("source_language", "target_language");

-- CreateIndex
CREATE UNIQUE INDEX "translation_cache_original_text_source_language_target_lang_key" ON "translation_cache"("original_text", "source_language", "target_language");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_responsible_person_id_fkey" FOREIGN KEY ("responsible_person_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_operations" ADD CONSTRAINT "bank_operations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_operations" ADD CONSTRAINT "bank_operations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_settlement" ADD CONSTRAINT "doc_settlement_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_settlement" ADD CONSTRAINT "doc_settlement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_messages" ADD CONSTRAINT "conversation_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "conversation_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assistant_preferences" ADD CONSTRAINT "assistant_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
