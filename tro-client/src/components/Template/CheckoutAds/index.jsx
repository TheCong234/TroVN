/* eslint-disable react/prop-types */
import { Descriptions } from "antd";

const Index = ({ buyPackage }) => {
  // const { adsPackage } = useUserStore();

  const items = [
    {
      key: "1",
      label: "Gói",
      children: buyPackage.name,
    },
    {
      key: "2",
      label: "Chi tiết gói",
      children: buyPackage?.description,
    },
    {
      key: "3",
      label: "Thời gian",
      children: `${buyPackage?.duration} ngày`,
    },
    {
      key: "4",
      label: "Tổng tiền",
      span: 2,
      children: (
        <div className="font-bold text-xl">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(buyPackage?.price)}
        </div>
      ),
    },
  ];
  return (
    <Descriptions
      layout="vertical"
      column={1}
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
