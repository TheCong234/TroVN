-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_advertisingPackageId_fkey" FOREIGN KEY ("advertisingPackageId") REFERENCES "AdvertisingPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
