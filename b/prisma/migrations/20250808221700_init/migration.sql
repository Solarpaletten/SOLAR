-- CreateEnum
CREATE TYPE "prisma_schema"."UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "prisma_schema"."CompanyUserRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'VIEWER');

-- CreateEnum
CREATE TYPE "prisma_schema"."ClientRole" AS ENUM ('CLIENT', 'SUPPLIER', 'BOTH');

-- CreateEnum
CREATE TYPE "prisma_schema"."Currency" AS ENUM ('EUR', 'USD', 'AED', 'UAH', 'GBP');

-- CreateEnum
CREATE TYPE "prisma_schema"."DocumentStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "prisma_schema"."PaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "prisma_schema"."DeliveryStatus" AS ENUM ('PENDING', 'PARTIAL', 'DELIVERED', 'IN_TRANSIT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "prisma_schema"."SalesDocumentType" AS ENUM ('QUOTE', 'ORDER', 'INVOICE', 'DELIVERY_NOTE', 'RECEIPT');

-- CreateEnum
CREATE TYPE "prisma_schema"."PurchaseOperationType" AS ENUM ('PURCHASE', 'RETURN', 'CORRECTION', 'TRANSFER');

-- CreateEnum
CREATE TYPE "prisma_schema"."WarehouseStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "prisma_schema"."BankOperationType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');

-- CreateTable
CREATE TABLE "prisma_schema"."users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "phone" VARCHAR(20),
    "role" "prisma_schema"."UserRole" NOT NULL DEFAULT 'USER',
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "verification_token" VARCHAR(255),
    "reset_token" VARCHAR(255),
    "reset_token_expires" TIMESTAMP(3),
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "current_company_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."companies" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "short_name" VARCHAR(50),
    "description" TEXT,
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "website" VARCHAR(200),
    "legal_entity_type" VARCHAR(50) NOT NULL,
    "registration_number" VARCHAR(50),
    "vat_number" VARCHAR(50),
    "legal_address" TEXT,
    "actual_address" TEXT,
    "tax_country" VARCHAR(3) NOT NULL DEFAULT 'UAE',
    "base_currency" "prisma_schema"."Currency" NOT NULL DEFAULT 'AED',
    "owner_id" INTEGER NOT NULL,
    "director_name" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "setup_completed" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."company_users" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "prisma_schema"."CompanyUserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."clients" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "abbreviation" VARCHAR(100),
    "code" VARCHAR(50),
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "fax" VARCHAR(20),
    "website" VARCHAR(200),
    "contact_information" TEXT,
    "role" "prisma_schema"."ClientRole" NOT NULL DEFAULT 'CLIENT',
    "is_juridical" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_foreigner" BOOLEAN NOT NULL DEFAULT false,
    "country" VARCHAR(100),
    "legal_address" TEXT,
    "actual_address" TEXT,
    "business_license_code" VARCHAR(50),
    "vat_code" VARCHAR(50),
    "vat_rate" DECIMAL(5,2),
    "eori_code" VARCHAR(50),
    "foreign_taxpayer_code" VARCHAR(50),
    "registration_number" VARCHAR(50),
    "credit_sum" DECIMAL(15,2) DEFAULT 0,
    "pay_per" VARCHAR(50),
    "currency" "prisma_schema"."Currency" NOT NULL DEFAULT 'EUR',
    "payment_terms" VARCHAR(100),
    "automatic_debt_reminder" BOOLEAN DEFAULT false,
    "registration_date" DATE,
    "date_of_birth" DATE,
    "sabis_customer_name" VARCHAR(200),
    "sabis_customer_code" VARCHAR(50),
    "additional_information" TEXT,
    "notes" TEXT,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."client_addresses" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL,
    "postcode" VARCHAR(20),
    "employee_id" INTEGER,
    "is_registration" BOOLEAN NOT NULL DEFAULT false,
    "is_correspondence" BOOLEAN NOT NULL DEFAULT false,
    "is_load" BOOLEAN NOT NULL DEFAULT false,
    "is_unload" BOOLEAN NOT NULL DEFAULT false,
    "is_department" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR(100),
    "description" TEXT,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."client_bank_accounts" (
    "id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "account_number" VARCHAR(50) NOT NULL,
    "bank_name" VARCHAR(100) NOT NULL,
    "bank_code" VARCHAR(20),
    "swift_code" VARCHAR(20),
    "iban" VARCHAR(50),
    "currency" "prisma_schema"."Currency" NOT NULL DEFAULT 'EUR',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."products" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "unit" VARCHAR(20) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "cost_price" DECIMAL(10,2),
    "currency" "prisma_schema"."Currency" NOT NULL DEFAULT 'EUR',
    "vat_rate" DECIMAL(5,2),
    "category" VARCHAR(100),
    "subcategory" VARCHAR(100),
    "min_stock" DECIMAL(10,2),
    "current_stock" DECIMAL(10,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_service" BOOLEAN NOT NULL DEFAULT false,
    "batch_tracking" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."sales" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "document_number" VARCHAR(50) NOT NULL,
    "document_date" DATE NOT NULL,
    "document_type" "prisma_schema"."SalesDocumentType" NOT NULL DEFAULT 'INVOICE',
    "delivery_date" DATE,
    "due_date" DATE,
    "client_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER,
    "sales_manager_id" INTEGER,
    "subtotal" DECIMAL(15,2) NOT NULL,
    "vat_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "currency" "prisma_schema"."Currency" NOT NULL DEFAULT 'EUR',
    "payment_status" "prisma_schema"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "delivery_status" "prisma_schema"."DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "document_status" "prisma_schema"."DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."sale_items" (
    "id" SERIAL NOT NULL,
    "sale_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "line_number" INTEGER,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unit_price_base" DECIMAL(10,2) NOT NULL,
    "discount_percent" DECIMAL(5,2) DEFAULT 0,
    "total_discount" DECIMAL(15,2) DEFAULT 0,
    "vat_rate" DECIMAL(5,2),
    "vat_amount" DECIMAL(15,2),
    "line_total" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."purchases" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "document_number" VARCHAR(50) NOT NULL,
    "document_date" DATE NOT NULL,
    "operation_type" "prisma_schema"."PurchaseOperationType" NOT NULL DEFAULT 'PURCHASE',
    "supplier_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER,
    "purchase_manager_id" INTEGER,
    "subtotal" DECIMAL(15,2) NOT NULL,
    "vat_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "currency" "prisma_schema"."Currency" NOT NULL DEFAULT 'EUR',
    "payment_status" "prisma_schema"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "delivery_status" "prisma_schema"."DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "document_status" "prisma_schema"."DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."purchase_items" (
    "id" SERIAL NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "line_number" INTEGER,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unit_price_base" DECIMAL(10,2) NOT NULL,
    "vat_rate" DECIMAL(5,2),
    "vat_amount" DECIMAL(15,2),
    "line_total" DECIMAL(15,2) NOT NULL,
    "employee_id" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."warehouses" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "description" TEXT,
    "address" TEXT,
    "manager_id" INTEGER,
    "status" "prisma_schema"."WarehouseStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."bank_operations" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "doc_number" VARCHAR(50) NOT NULL,
    "operation_date" DATE NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" "prisma_schema"."Currency" NOT NULL DEFAULT 'EUR',
    "type" "prisma_schema"."BankOperationType" NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "client_id" INTEGER,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."chart_of_accounts" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "account_code" VARCHAR(20) NOT NULL,
    "account_name" VARCHAR(255) NOT NULL,
    "account_type" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "currency" "prisma_schema"."Currency",
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chart_of_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."vat_classifications" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "vat_rate" DECIMAL(5,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "vat_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."cost_centers" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "parent_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cost_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."intrastat_codes" (
    "id" SERIAL NOT NULL,
    "code_type" VARCHAR(20) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "intrastat_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."product_batches" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "batch_number" VARCHAR(50) NOT NULL,
    "product_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "supplier_id" INTEGER,
    "original_quantity" DECIMAL(15,3) NOT NULL,
    "current_quantity" DECIMAL(15,3) NOT NULL,
    "unit_cost" DECIMAL(15,2) NOT NULL,
    "total_cost" DECIMAL(15,2) NOT NULL,
    "currency" "prisma_schema"."Currency" NOT NULL DEFAULT 'EUR',
    "purchase_date" DATE NOT NULL,
    "expiry_date" DATE,
    "production_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "purchase_id" INTEGER,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."batch_movements" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "movement_type" VARCHAR(20) NOT NULL,
    "quantity" DECIMAL(15,3) NOT NULL,
    "unit_price" DECIMAL(15,2),
    "reference_type" VARCHAR(20),
    "reference_id" INTEGER,
    "description" TEXT,
    "notes" TEXT,
    "movement_date" DATE NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "batch_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prisma_schema"."accounting_entries" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "entry_number" VARCHAR(50) NOT NULL,
    "entry_date" DATE NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" "prisma_schema"."Currency" NOT NULL DEFAULT 'EUR',
    "account_debit" VARCHAR(10) NOT NULL,
    "account_credit" VARCHAR(10) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "notes" TEXT,
    "reference_type" VARCHAR(20),
    "reference_id" INTEGER,
    "product_id" INTEGER,
    "warehouse_id" INTEGER,
    "client_id" INTEGER,
    "batch_id" INTEGER,
    "is_automatic" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounting_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "prisma_schema"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "prisma_schema"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_token_key" ON "prisma_schema"."users"("verification_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_token_key" ON "prisma_schema"."users"("reset_token");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "prisma_schema"."users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "prisma_schema"."users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "prisma_schema"."users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "prisma_schema"."users"("is_active");

-- CreateIndex
CREATE INDEX "users_current_company_id_idx" ON "prisma_schema"."users"("current_company_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_code_key" ON "prisma_schema"."companies"("code");

-- CreateIndex
CREATE INDEX "companies_owner_id_idx" ON "prisma_schema"."companies"("owner_id");

-- CreateIndex
CREATE INDEX "companies_code_idx" ON "prisma_schema"."companies"("code");

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "prisma_schema"."companies"("name");

-- CreateIndex
CREATE INDEX "companies_is_active_idx" ON "prisma_schema"."companies"("is_active");

-- CreateIndex
CREATE INDEX "companies_tax_country_idx" ON "prisma_schema"."companies"("tax_country");

-- CreateIndex
CREATE INDEX "company_users_company_id_idx" ON "prisma_schema"."company_users"("company_id");

-- CreateIndex
CREATE INDEX "company_users_user_id_idx" ON "prisma_schema"."company_users"("user_id");

-- CreateIndex
CREATE INDEX "company_users_role_idx" ON "prisma_schema"."company_users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "company_users_company_id_user_id_key" ON "prisma_schema"."company_users"("company_id", "user_id");

-- CreateIndex
CREATE INDEX "clients_company_id_idx" ON "prisma_schema"."clients"("company_id");

-- CreateIndex
CREATE INDEX "clients_role_idx" ON "prisma_schema"."clients"("role");

-- CreateIndex
CREATE INDEX "clients_is_active_idx" ON "prisma_schema"."clients"("is_active");

-- CreateIndex
CREATE INDEX "clients_country_idx" ON "prisma_schema"."clients"("country");

-- CreateIndex
CREATE INDEX "clients_created_by_idx" ON "prisma_schema"."clients"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "clients_company_id_code_key" ON "prisma_schema"."clients"("company_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "clients_company_id_vat_code_key" ON "prisma_schema"."clients"("company_id", "vat_code");

-- CreateIndex
CREATE INDEX "client_addresses_client_id_idx" ON "prisma_schema"."client_addresses"("client_id");

-- CreateIndex
CREATE INDEX "client_addresses_country_idx" ON "prisma_schema"."client_addresses"("country");

-- CreateIndex
CREATE INDEX "client_addresses_is_correspondence_idx" ON "prisma_schema"."client_addresses"("is_correspondence");

-- CreateIndex
CREATE INDEX "client_bank_accounts_client_id_idx" ON "prisma_schema"."client_bank_accounts"("client_id");

-- CreateIndex
CREATE INDEX "client_bank_accounts_is_primary_idx" ON "prisma_schema"."client_bank_accounts"("is_primary");

-- CreateIndex
CREATE UNIQUE INDEX "client_bank_accounts_client_id_account_number_key" ON "prisma_schema"."client_bank_accounts"("client_id", "account_number");

-- CreateIndex
CREATE INDEX "products_company_id_idx" ON "prisma_schema"."products"("company_id");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "prisma_schema"."products"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "products_company_id_code_key" ON "prisma_schema"."products"("company_id", "code");

-- CreateIndex
CREATE INDEX "sales_company_id_idx" ON "prisma_schema"."sales"("company_id");

-- CreateIndex
CREATE INDEX "sales_document_date_idx" ON "prisma_schema"."sales"("document_date");

-- CreateIndex
CREATE INDEX "sales_client_id_idx" ON "prisma_schema"."sales"("client_id");

-- CreateIndex
CREATE INDEX "sales_payment_status_idx" ON "prisma_schema"."sales"("payment_status");

-- CreateIndex
CREATE UNIQUE INDEX "sales_company_id_document_number_key" ON "prisma_schema"."sales"("company_id", "document_number");

-- CreateIndex
CREATE INDEX "sale_items_sale_id_idx" ON "prisma_schema"."sale_items"("sale_id");

-- CreateIndex
CREATE INDEX "sale_items_product_id_idx" ON "prisma_schema"."sale_items"("product_id");

-- CreateIndex
CREATE INDEX "purchases_company_id_idx" ON "prisma_schema"."purchases"("company_id");

-- CreateIndex
CREATE INDEX "purchases_document_date_idx" ON "prisma_schema"."purchases"("document_date");

-- CreateIndex
CREATE INDEX "purchases_supplier_id_idx" ON "prisma_schema"."purchases"("supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_company_id_document_number_key" ON "prisma_schema"."purchases"("company_id", "document_number");

-- CreateIndex
CREATE INDEX "purchase_items_purchase_id_idx" ON "prisma_schema"."purchase_items"("purchase_id");

-- CreateIndex
CREATE INDEX "purchase_items_product_id_idx" ON "prisma_schema"."purchase_items"("product_id");

-- CreateIndex
CREATE INDEX "warehouses_company_id_idx" ON "prisma_schema"."warehouses"("company_id");

-- CreateIndex
CREATE INDEX "warehouses_status_idx" ON "prisma_schema"."warehouses"("status");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_company_id_code_key" ON "prisma_schema"."warehouses"("company_id", "code");

-- CreateIndex
CREATE INDEX "bank_operations_company_id_idx" ON "prisma_schema"."bank_operations"("company_id");

-- CreateIndex
CREATE INDEX "bank_operations_operation_date_idx" ON "prisma_schema"."bank_operations"("operation_date");

-- CreateIndex
CREATE INDEX "bank_operations_type_idx" ON "prisma_schema"."bank_operations"("type");

-- CreateIndex
CREATE INDEX "chart_of_accounts_company_id_idx" ON "prisma_schema"."chart_of_accounts"("company_id");

-- CreateIndex
CREATE INDEX "chart_of_accounts_account_type_idx" ON "prisma_schema"."chart_of_accounts"("account_type");

-- CreateIndex
CREATE UNIQUE INDEX "chart_of_accounts_company_id_account_code_key" ON "prisma_schema"."chart_of_accounts"("company_id", "account_code");

-- CreateIndex
CREATE INDEX "vat_classifications_company_id_idx" ON "prisma_schema"."vat_classifications"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "vat_classifications_company_id_code_key" ON "prisma_schema"."vat_classifications"("company_id", "code");

-- CreateIndex
CREATE INDEX "cost_centers_company_id_idx" ON "prisma_schema"."cost_centers"("company_id");

-- CreateIndex
CREATE INDEX "cost_centers_parent_id_idx" ON "prisma_schema"."cost_centers"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "cost_centers_company_id_code_key" ON "prisma_schema"."cost_centers"("company_id", "code");

-- CreateIndex
CREATE INDEX "intrastat_codes_code_type_idx" ON "prisma_schema"."intrastat_codes"("code_type");

-- CreateIndex
CREATE UNIQUE INDEX "intrastat_codes_code_type_code_key" ON "prisma_schema"."intrastat_codes"("code_type", "code");

-- CreateIndex
CREATE INDEX "product_batches_company_id_idx" ON "prisma_schema"."product_batches"("company_id");

-- CreateIndex
CREATE INDEX "product_batches_product_id_idx" ON "prisma_schema"."product_batches"("product_id");

-- CreateIndex
CREATE INDEX "product_batches_warehouse_id_idx" ON "prisma_schema"."product_batches"("warehouse_id");

-- CreateIndex
CREATE INDEX "product_batches_supplier_id_idx" ON "prisma_schema"."product_batches"("supplier_id");

-- CreateIndex
CREATE INDEX "product_batches_status_idx" ON "prisma_schema"."product_batches"("status");

-- CreateIndex
CREATE INDEX "product_batches_purchase_date_idx" ON "prisma_schema"."product_batches"("purchase_date");

-- CreateIndex
CREATE UNIQUE INDEX "product_batches_company_id_batch_number_key" ON "prisma_schema"."product_batches"("company_id", "batch_number");

-- CreateIndex
CREATE INDEX "batch_movements_company_id_idx" ON "prisma_schema"."batch_movements"("company_id");

-- CreateIndex
CREATE INDEX "batch_movements_batch_id_idx" ON "prisma_schema"."batch_movements"("batch_id");

-- CreateIndex
CREATE INDEX "batch_movements_movement_type_idx" ON "prisma_schema"."batch_movements"("movement_type");

-- CreateIndex
CREATE INDEX "batch_movements_movement_date_idx" ON "prisma_schema"."batch_movements"("movement_date");

-- CreateIndex
CREATE INDEX "batch_movements_reference_type_reference_id_idx" ON "prisma_schema"."batch_movements"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "accounting_entries_company_id_idx" ON "prisma_schema"."accounting_entries"("company_id");

-- CreateIndex
CREATE INDEX "accounting_entries_entry_date_idx" ON "prisma_schema"."accounting_entries"("entry_date");

-- CreateIndex
CREATE INDEX "accounting_entries_account_debit_idx" ON "prisma_schema"."accounting_entries"("account_debit");

-- CreateIndex
CREATE INDEX "accounting_entries_account_credit_idx" ON "prisma_schema"."accounting_entries"("account_credit");

-- CreateIndex
CREATE INDEX "accounting_entries_reference_type_reference_id_idx" ON "prisma_schema"."accounting_entries"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "accounting_entries_batch_id_idx" ON "prisma_schema"."accounting_entries"("batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounting_entries_company_id_entry_number_key" ON "prisma_schema"."accounting_entries"("company_id", "entry_number");

-- AddForeignKey
ALTER TABLE "prisma_schema"."companies" ADD CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."company_users" ADD CONSTRAINT "company_users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."company_users" ADD CONSTRAINT "company_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prisma_schema"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."clients" ADD CONSTRAINT "clients_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."clients" ADD CONSTRAINT "clients_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."client_addresses" ADD CONSTRAINT "client_addresses_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "prisma_schema"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."client_addresses" ADD CONSTRAINT "client_addresses_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "prisma_schema"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."client_bank_accounts" ADD CONSTRAINT "client_bank_accounts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "prisma_schema"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."products" ADD CONSTRAINT "products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."products" ADD CONSTRAINT "products_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."sales" ADD CONSTRAINT "sales_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."sales" ADD CONSTRAINT "sales_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."sales" ADD CONSTRAINT "sales_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "prisma_schema"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."sales" ADD CONSTRAINT "sales_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "prisma_schema"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."sales" ADD CONSTRAINT "sales_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "prisma_schema"."warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."sales" ADD CONSTRAINT "sales_sales_manager_id_fkey" FOREIGN KEY ("sales_manager_id") REFERENCES "prisma_schema"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "prisma_schema"."sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."sale_items" ADD CONSTRAINT "sale_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "prisma_schema"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."purchases" ADD CONSTRAINT "purchases_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."purchases" ADD CONSTRAINT "purchases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."purchases" ADD CONSTRAINT "purchases_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "prisma_schema"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."purchases" ADD CONSTRAINT "purchases_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "prisma_schema"."clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."purchases" ADD CONSTRAINT "purchases_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "prisma_schema"."warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."purchases" ADD CONSTRAINT "purchases_purchase_manager_id_fkey" FOREIGN KEY ("purchase_manager_id") REFERENCES "prisma_schema"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."purchase_items" ADD CONSTRAINT "purchase_items_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "prisma_schema"."purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."purchase_items" ADD CONSTRAINT "purchase_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "prisma_schema"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."purchase_items" ADD CONSTRAINT "purchase_items_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "prisma_schema"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."warehouses" ADD CONSTRAINT "warehouses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."warehouses" ADD CONSTRAINT "warehouses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."warehouses" ADD CONSTRAINT "warehouses_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "prisma_schema"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."bank_operations" ADD CONSTRAINT "bank_operations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."bank_operations" ADD CONSTRAINT "bank_operations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."bank_operations" ADD CONSTRAINT "bank_operations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "prisma_schema"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."vat_classifications" ADD CONSTRAINT "vat_classifications_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."cost_centers" ADD CONSTRAINT "cost_centers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."cost_centers" ADD CONSTRAINT "cost_centers_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "prisma_schema"."cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."product_batches" ADD CONSTRAINT "product_batches_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."product_batches" ADD CONSTRAINT "product_batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "prisma_schema"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."product_batches" ADD CONSTRAINT "product_batches_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "prisma_schema"."warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."product_batches" ADD CONSTRAINT "product_batches_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "prisma_schema"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."product_batches" ADD CONSTRAINT "product_batches_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "prisma_schema"."purchases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."product_batches" ADD CONSTRAINT "product_batches_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."batch_movements" ADD CONSTRAINT "batch_movements_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."batch_movements" ADD CONSTRAINT "batch_movements_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "prisma_schema"."product_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."batch_movements" ADD CONSTRAINT "batch_movements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."accounting_entries" ADD CONSTRAINT "accounting_entries_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "prisma_schema"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."accounting_entries" ADD CONSTRAINT "accounting_entries_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "prisma_schema"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."accounting_entries" ADD CONSTRAINT "accounting_entries_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "prisma_schema"."warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."accounting_entries" ADD CONSTRAINT "accounting_entries_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "prisma_schema"."clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."accounting_entries" ADD CONSTRAINT "accounting_entries_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "prisma_schema"."product_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prisma_schema"."accounting_entries" ADD CONSTRAINT "accounting_entries_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "prisma_schema"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
