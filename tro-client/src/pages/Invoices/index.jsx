import { getInvoiceByUser } from "@/apis/invoice";
import { getPaymentMomo } from "@/apis/payment";
import InvoiceItem from "@/components/InvoiceItem";
import { PACKAGE_TYPE } from "@/enums";
import useUserStore from "@/hooks/useUserStore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const {setPackageType, setBuyPackage} = useUserStore();
  const [invoices, setInvoices] = useState(null);

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, message, success } = await getInvoiceByUser(1, 10);
        if (success) {
          setInvoices(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const handlePaymentInvoice = async (id) => {
    try {
      const { data, message, success } = await getPaymentMomo(PACKAGE_TYPE.INVOICE_PACKAGE);
      if (success) {
        console.log("Thanh cong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuying = (item) => {
    setBuyPackage(item);
    setPackageType(PACKAGE_TYPE.INVOICE_PACKAGE)
    navigate("/checkout");
  };

  return (
    <div className="container md:w-[640px]">
      <div>
        <h1 className="font-semibold text-3xl my-10">Hóa đơn</h1>
        <div className="grid grid-cols-1 gap-y-1">
          {invoices?.contents?.map((item, index) => (
            <InvoiceItem key={item.id} invoice={item} handleBuying={handleBuying} />
          ))}
          {invoices?.totalElement === 0 && (
            <div className="text-md">Bạn không có hóa đơn mới</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
