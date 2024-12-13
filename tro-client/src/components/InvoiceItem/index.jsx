import { formatCurrency } from "@/utils/helpers";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { HandCoins } from "lucide-react";
import { formattedDate } from "../Modals/CreateInvoiceModal";

const InvoiceItem = ({ invoice, handleBuying }) => {
  const total =
    parseFloat(invoice?.waterFee) +
    parseFloat(invoice?.electricityFee) +
    parseFloat(invoice?.otherFee);

  return (
    <div className="bg-gray-50 p-3 rounded-md relative">
      <div>
        <h1 className="text-lg font-semibold">Hóa đơn</h1>
        <p className="text-gray-400">Hóa đơn cần phải trả </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 text-base mt-2 gap-y-2">
        <div className="flex items-center gap-1">
          <div>Tiền điện :</div>
          <p>{formatCurrency(invoice?.electricityFee)}</p>
        </div>
        <div className="flex items-center gap-1">
          <div>Tiền nước :</div>
          <p>{formatCurrency(invoice?.waterFee)}</p>
        </div>
        <div className="flex items-center gap-1">
          <div>Chi phí khác :</div>
          <p>{formatCurrency(invoice?.otherFee)}</p>
        </div>
        {total < parseFloat(invoice?.totalAmount) && (
          <div className="flex items-center gap-1">
            <div>Tiền nhà :</div>
            <p>{formatCurrency(invoice?.totalAmount - total)}</p>
          </div>
        )}

        <div className="flex items-center gap-1">
          <div>Tổng tiền phải trả :</div>
          <p>{formatCurrency(invoice?.totalAmount)}</p>
        </div>

        <div className="flex items-center gap-1">
          <div>Hạn thanh toán :</div>
          <p>{formattedDate(invoice?.dueDate)}</p>
        </div>
      </div>
      <span className="absolute top-2 right-2">
        <Badge variant={invoice?.paymentStatus ? "success" : "destructive"}>
          {invoice?.paymentStatus ? "Đã thanh toán" : "Chờ thanh toán"}
        </Badge>
      </span>

      <div className="text-right mt-4">
        {invoice?.paymentStatus && (
          <Button variant="outline">Đã thanh toán</Button>
        )}
        {!invoice?.paymentStatus && (
          <Button size="sm" onClick={() => handleBuying(invoice)}>
            <HandCoins size={18} className="mr-2" /> Thanh toán ngay
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvoiceItem;
