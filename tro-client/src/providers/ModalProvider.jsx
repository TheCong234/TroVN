import { useEffect, useState } from "react";

import { AdsCreateModal } from "@/components/Modals/AdsCreateModal";
import { AppointmentModal } from "@/components/Modals/AppointmentModal";
import { FilterModal } from "@/components/Modals/FilterModal";
import { ImagePreviewModal } from "@/components/Modals/ImagePreviewModal";
import { VerifyCodeModal } from "@/components/Modals/VerifyCodeModal";
import { AppointmentDetailModal } from "@/components/Modals/AppointmentDetailModal";
import { ContractModal } from "@/components/Modals/ContractModal";
import { CreateInvoiceModal } from "@/components/Modals/CreateInvoiceModal";
import { HostInfoModal } from "@/components/Modals/HostInfoModal";
import { CreatePaymentInfoModal } from "@/components/Modals/CreatePaymentInfoModal";
import { WithdrawalRequestCreateModal } from "@/components/Modals/WithdrawalRequestCreateModal";
import { BroadcastMessageModal } from "@/components/Modals/BroadcastMessageModal";

export const ModalProvider = () => {
  const [isMounted, setItMounted] = useState(false);

  useEffect(() => {
    setItMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <FilterModal />
      <VerifyCodeModal />
      <ImagePreviewModal />
      <AdsCreateModal />
      <AppointmentModal />
      <AppointmentDetailModal />
      <ContractModal />
      <CreateInvoiceModal />
      <HostInfoModal />
      <CreatePaymentInfoModal />
      <WithdrawalRequestCreateModal />
      <BroadcastMessageModal />
    </>
  );
};
