import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { BiMoney } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { getAdvertisingPackages } from "@/apis/advertising";
import useUserStore from "@/hooks/useUserStore";
import { PACKAGE_TYPE } from "@/enums";

const backgroundColors = [
  "bg-red-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-yellow-200",
];
const Index = () => {
  const [advertisingPackages, setAdvertisingPackages] = useState([]);
  const { setBuyPackage, setPackageType } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { data } = await getAdvertisingPackages();
      setAdvertisingPackages(data);
    })();
  }, []);

  const handleBuying = (item) => {
    setBuyPackage(item);
    setPackageType(PACKAGE_TYPE.ADS_PACKAGE)
    navigate("/checkout");
  };

  return (
    <div>
      <Breadcrumb className="hidden md:flex mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Gói quảng bá</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Bảng giá dịch vụ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="h-full">
        <CardHeader>
          <CardTitle> Bảng giá dịch vụ</CardTitle>
          <CardDescription>
            TROVN xin quý khách hàng thân thương được phép điều chỉnh giá dịch
            vụ.
          </CardDescription>
        </CardHeader>
        <CardContent className=" lg:h-3/4 h-full">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 h-full">
            {advertisingPackages.map((item, index) => (
              <div
                key={item.id}
                className="h-full overflow-hidden flex flex-col justify-between rounded-xl shadow-md border"
              >
                <div>
                  <div
                    className={` h-14 text-lg font-medium flex items-center justify-center ${
                      backgroundColors[index % backgroundColors.length]
                    }`}
                  >
                    {item.name}
                  </div>
                  <ul className="p-6 list-disc text-base grid gap-3">
                    <li>{item.description}</li>
                    <li>
                      Thời gian hiển thị: <strong>{item.duration} ngày</strong>
                    </li>
                    <li>
                      Xuất hiện vị trí đầu tiên ở <strong>trang chủ</strong>
                    </li>
                    <li>
                      Tiếp cận khách hàng <strong>tốt</strong>.
                    </li>
                    <li>
                      <strong className="text-xl font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </strong>
                      .
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center p-4">
                  <Button
                    variant="outline"
                    className="h-10 flex items-center justify-center gap-2"
                    onClick={() => handleBuying(item)}
                  >
                    Mua ngay <BiMoney />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
