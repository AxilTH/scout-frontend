-- AlterTable
ALTER TABLE "User" ADD COLUMN     "education_institution_id" INTEGER;

-- CreateTable
CREATE TABLE "EducationInstitution" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationInstitution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_education_institution_id_fkey" FOREIGN KEY ("education_institution_id") REFERENCES "EducationInstitution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
