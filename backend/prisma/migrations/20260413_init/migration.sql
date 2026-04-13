-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('INDIVIDUAL', 'FAMILY', 'CORPORATE');
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "BirdSpecies" AS ENUM ('PHEASANT', 'CHUKAR', 'QUAIL');
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'CASH', 'CHECK');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'REFUNDED');

CREATE TABLE "CorporateAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "annualDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidAnnualDue" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CorporateAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "type" "MemberType" NOT NULL DEFAULT 'INDIVIDUAL',
    "corporateAccountId" TEXT,
    "seasonBirdBalance" INTEGER NOT NULL DEFAULT 0,
    "seasonBirdsUsed" INTEGER NOT NULL DEFAULT 0,
    "waiverSigned" BOOLEAN NOT NULL DEFAULT false,
    "waiverSignedAt" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxHunters" INTEGER NOT NULL DEFAULT 6,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "guideRequested" BOOLEAN NOT NULL DEFAULT false,
    "guideId" TEXT,
    "pheasantsReleased" INTEGER NOT NULL DEFAULT 0,
    "chukarsReleased" INTEGER NOT NULL DEFAULT 0,
    "quailReleased" INTEGER NOT NULL DEFAULT 0,
    "birdsHarvested" INTEGER NOT NULL DEFAULT 0,
    "birdCleaning" BOOLEAN NOT NULL DEFAULT false,
    "trapHouse" BOOLEAN NOT NULL DEFAULT false,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cancellationDeadline" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BirdInventory" (
    "id" TEXT NOT NULL,
    "species" "BirdSpecies" NOT NULL,
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BirdInventory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BirdInventory_species_key" ON "BirdInventory"("species");

CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "bookingId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "processingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "stripePaymentIntentId" TEXT,
    "notes" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Member" ADD CONSTRAINT "Member_corporateAccountId_fkey" FOREIGN KEY ("corporateAccountId") REFERENCES "CorporateAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
