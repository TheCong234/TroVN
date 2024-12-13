import {
  getAnalyticCountAppointment,
  getAnalyticListingActiveAndNonActive,
  getBalanceInProcess,
  getInvoiceStatusCount,
} from "@/apis/analytics";
import BarChartV2 from "@/components/Chart/BarChartV2";
import PieChartV2 from "@/components/Chart/PieChartV2";
import HostStatistic from "@/components/HostStatistic";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useUserStore from "@/hooks/useUserStore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const chartData = [
  { name: "Desktop", value: 186 },
  { name: "Mobile", value: 80 },
];

const chartConfig = {
  active: {
    label: "active",
    color: "#E74A6D",
  },
  nonActive: {
    label: "nonActive",
    color: "#60a5fa",
  },
  rented: {
    label: "rented",
    color: "#2563EB",
  },
};

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [balanceInProcess, setBalanceInProcess] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState({
    invoicePaidCount: 0,
    invoiceNotPaidCount: 0,
  });
  const { balance } = useUserStore();
  useEffect(() => {
    const fetch = async () => {
      try {
        const [res1, res2, res3, res4] = await Promise.all([
          getAnalyticCountAppointment(),
          getAnalyticListingActiveAndNonActive(),
          getBalanceInProcess(),
          getInvoiceStatusCount(),
        ]);
        if (res1.success) {
          setBarChartData(res1.data);
        }
        if (res2.success) {
          setPieChartData(res2.data);
        }
        if (res3.success) {
          setBalanceInProcess(res3.data);
        }
        if (res4.success) {
          setInvoiceCount(res4.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);
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
            <BreadcrumbPage>Bảng điều khiển</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Bảng điều khiển</CardTitle>
          <CardDescription>Bảng điều khiển cơ bản.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-lg mb-4">Thống kê</div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <HostStatistic
              title="Tổng tiền"
              type="currency"
              value={balance}
              footer={
                <div className=" flex justify-end">
                  <Link to="withdrawal-request">
                    <Button size="sm" variant="outline">
                      Rút ngay
                    </Button>
                  </Link>
                </div>
              }
            />
            <HostStatistic
              title="Tổng tiền đang xử lý"
              type="currency"
              value={balanceInProcess}
              footer={
                <div className=" flex justify-end">
                  <Link to="withdrawal-request">
                    <Button size="sm" variant="outline">
                      Chi tiết
                    </Button>
                  </Link>
                </div>
              }
            />
            <HostStatistic
              title="Số lượng hóa đơn đã thanh toán"
              value={invoiceCount.invoicePaidCount}
              footer={
                <div className=" flex justify-end">
                  <Link to="invoice-list">
                    <Button size="sm" variant="outline">
                      Chi tiết
                    </Button>
                  </Link>
                </div>
              }
            />
            <HostStatistic
              title="Số lượng hóa đơn chưa thanh toán"
              value={invoiceCount.invoiceNotPaidCount}
              footer={
                <div className=" flex justify-end">
                  <Link to="invoice-list">
                    <Button size="sm" variant="outline">
                      Chi tiết
                    </Button>
                  </Link>
                </div>
              }
            />
          </div>
          <div className="text-lg mb-4">Biểu đồ</div>
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <PieChartV2
                chartData={pieChartData}
                labelKey="date"
                dataKey="value"
                nameKey="Số lượng"
                chartConfig={chartConfig}
              />
              <div className="text-center text-muted-foreground text-sm">
                Biều đồ lịch hẹn trong 14 ngày tiếp theo.
              </div>
            </div>
            <div className="col-span-1">
              <BarChartV2
                chartConfig={{
                  date: {
                    label: "date",
                    color: "#E74A6D",
                  },
                }}
                labelKey="date"
                dataKey="value"
                nameKey="Số lượng"
                chartData={barChartData}
              />
              <div className="text-center text-muted-foreground text-sm">
                Biều đồ lịch hẹn trong 14 ngày tiếp theo.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
