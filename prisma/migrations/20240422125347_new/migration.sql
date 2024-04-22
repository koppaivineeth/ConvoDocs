-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'PROCESSING', 'FAILED', 'SUCCESS');

-- CreateTable
CREATE TABLE "user_files" (
    "fileId" TEXT NOT NULL,
    "fileName" VARCHAR(45) NOT NULL,
    "uploadStatus" "UploadStatus" NOT NULL DEFAULT 'PENDING',
    "url" VARCHAR(145) NOT NULL,
    "key" VARCHAR(145),
    "fileType" VARCHAR(100),
    "isSelected" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" VARCHAR(50),
    "userId" VARCHAR(45) NOT NULL,

    CONSTRAINT "user_files_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "users" (
    "userId" VARCHAR(50) NOT NULL,
    "userEmail" VARCHAR(45) NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "subscriptionId" VARCHAR(45),
    "priceId" VARCHAR(45),
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("userEmail")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isUserMessage" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" VARCHAR(50),
    "userId" TEXT,
    "fileId" TEXT,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userId_UNIQUE" ON "users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "email_UNIQUE" ON "users"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_subscription_id_key" ON "users"("stripe_subscription_id");

-- AddForeignKey
ALTER TABLE "user_files" ADD CONSTRAINT "user_files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "user_files"("fileId") ON DELETE SET NULL ON UPDATE CASCADE;
