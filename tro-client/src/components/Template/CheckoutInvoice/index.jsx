/* eslint-disable react/prop-types */
import { formatCurrency, formatDateCount } from "@/utils/helpers";
import { Descriptions } from "antd";

const Index = ({ buyPackage }) => {
  const items = [
    {
      key: "1",
      label: "Tiền điện",
      children: formatCurrency(buyPackage.electricityFee),
    },
    {
      key: "2",
      label: "Tiên nước",
      children:  formatCurrency(buyPackage.waterFee),
    },
    {
      key: "3",
      label: "Chi phí khác",
      children: formatCurrency(buyPackage.otherFee),
    },
    {
      key: "4",
      label: "Tổng tiền",
      span: 2,
      children: formatCurrency(buyPackage.totalAmount),
    },
    {
      key: "5",
      label: "Hạn thanh toán",
      span: 2,
      children: formatDateCount(buyPackage.dueDate),
    }
  ];
  return (
     <Descriptions
      layout="vertical"
      column={2}
      labelStyle={{
        fontSize: 16,
      }}
      contentStyle={{
        fontSize: 18,
      }}
      items={items}
    />
  );
};

export default Index;
