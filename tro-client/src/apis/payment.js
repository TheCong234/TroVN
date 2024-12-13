import { PaymentV1 } from "@/constants/endpoints";
import useUserStore from "@/hooks/useUserStore";
import { apiClient } from "./apiClient";
import qs from "query-string";
import { PACKAGE_TYPE } from "@/enums";

export const getPaymentMomo = async (requestType) => {
  const { buyPackage } = useUserStore.getState();
  console.log(buyPackage);
  if (!buyPackage) {
    throw new Error("Vui lòng chọn gói thanh toán")
  }

  const adsUrl = qs.stringifyUrl({
    url: PaymentV1.GET_MOMO_PAYMENT,
    query: {
      amount: buyPackage.price,
      orderInfo: buyPackage.name,
      buyPackageId: buyPackage.id,
      packageType: buyPackage.packageType,
      requestType,
    },
  });

  const invoiceUrl = qs.stringifyUrl({
    url: PaymentV1.GET_MOMO_PAYMENT,
    query: {
      amount: buyPackage.totalAmount,
      orderInfo: "Thanh toán hóa đơn",
      buyPackageId: buyPackage.id,
      packageType: buyPackage.packageType,
      requestType,
    },
  });

  const url =
    buyPackage.packageType === PACKAGE_TYPE.ADS_PACKAGE ? adsUrl : invoiceUrl;
  const res = await apiClient.get(url);
  return res.data;
};

export const getPaymentVNPay = async () => {
  const { buyPackage } = useUserStore.getState();
  if (buyPackage) {
    const url = qs.stringifyUrl({
      url: PaymentV1.GET_VNPAY_PAYMENT,
      query: {
        amount: buyPackage.price,
        orderInfo: buyPackage.name,
        buyPackageId: buyPackage.id,
        locale: "vi",
      },
    });
    // await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    const res = await apiClient.get(url);
    return res.data;
  } else {
    console.error("Không tìm thấy gói ");
  }
};

export const getPaymentsByStatus = async (status) => {
  const url = qs.stringifyUrl({
    url: PaymentV1.GET_PAYMENTS_BY_STATUS,
    query: {
      status,
    },
  });
  const { data } = await apiClient.get(url);
  return data;
};

export const deletePayment = async (id) => {
  const url = qs.stringifyUrl({
    url: PaymentV1.DELETE_PAYMENT + id,
  });
  const { data } = await apiClient.delete(url);
  return data;
};

export const getPaymentByUser = async () => {
  const url = qs.stringifyUrl({
    url: PaymentV1.GET_PAYMENT_USER,
  });
  const { data } = await apiClient.get(url);
  return data;
};
