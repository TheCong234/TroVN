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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAppointmentsByHost,
  updateAppointmentsByHost,
} from "@/apis/appointment";
import { useEffect, useState } from "react";

import { APPOINTMENT_STATUS } from "@/enums";
import { Badge } from "@/components/ui/badge";
import { BiCheck } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { TableEmpty } from "@/components/TableEmpty";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { filter } from "lodash";
import { format } from "date-fns";
import { getStatusColor } from "@/utils/helpers";
import moment from "moment";
import { toast } from "sonner";

const Appointment = () => {
  const [appointments, setAppointments] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: undefined,
    toDate: undefined,
    status: undefined,
    reload: false,
  });

  const handleReload = () => {
    setFilters((prev) => ({
      ...prev,
      reload: !prev.reload,
    }));
  };

  const handleChangeFilters = (e, name) => {
    setAppointments((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, success, message } = await getAppointmentsByHost(
          1,
          20,
          filters.fromDate,
          filters.toDate,
          filters.status
        );
        if (success) {
          setAppointments(data.appointments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [filters]);

  const handleUpdateAppointments = async (id, value) => {
    const toastId = toast.loading("Đang chờ...", { position: "top-center" });
    try {
      const { data, success, message } = await updateAppointmentsByHost(id, {
        status: value,
      });
      if (success) {
        handleReload();
        toast.success(message, { position: "top-center" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      toast.dismiss(toastId);
    }
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
            <BreadcrumbPage>Lịch xem phòng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Cuộc hẹn xem phòng</CardTitle>
          <CardDescription>Danh sách các yêu cầu xem phòng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-x-4">
            <div className="col-span-3"></div>
            <div className="col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters?.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters?.fromDate ? (
                      format(filters?.fromDate, "PPP")
                    ) : (
                      <span>Từ ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters?.fromDate}
                    onSelect={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        fromDate: dayjs(value).utc().toISOString(),
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters?.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters?.toDate ? (
                      format(filters?.toDate, "PPP")
                    ) : (
                      <span>Đến ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters?.toDate}
                    onSelect={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        toDate: dayjs(value).utc().toISOString(),
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-1">
              <Select
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
                className="w-full"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thaí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={null}>Tất cả</SelectItem>
                    {Object.keys(APPOINTMENT_STATUS).map((item) => (
                      <SelectItem value={item}>
                        {APPOINTMENT_STATUS[item]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Tên người xem</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tùy chọn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments?.map((appoint, index) => (
                <TableRow key={appoint.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {appoint?.user?.fullName || appoint?.user?.email}
                  </TableCell>
                  <TableCell>{appoint?.listing?.title?.slice(0, 20)}</TableCell>
                  <TableCell>
                    {appoint?.listing?.address?.slice(0, 30)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {dayjs
                        .utc(appoint?.appointmentDate)
                        .format("YYYY-MM-DD HH:mm:ss")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor: getStatusColor(appoint?.status),
                      }}
                    >
                      {APPOINTMENT_STATUS[appoint?.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {appoint?.status === "PENDING" && (
                      <div className="flex  gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateAppointments(appoint.id, "CANCELED")
                          }
                        >
                          Từ chối
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateAppointments(appoint.id, "CONFIRMER")
                          }
                        >
                          Chấp nhận
                        </Button>
                      </div>
                    )}
                    {appoint?.status !== "PENDING" &&
                      appoint?.status !== "CONFIRMER" && (
                        <div className="flex justify-center">
                          <Button disabled variant="outline" size="sm">
                            Đã xử lý
                          </Button>
                        </div>
                      )}
                    {appoint?.status === "CONFIRMER" && (
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateAppointments(appoint.id, "CANCELED")
                          }
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleUpdateAppointments(appoint.id, "DONE")
                          }
                        >
                          <BiCheck size={20} className="mr-1" />
                          <span>Xác nhận đã thuê</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {appointments?.length === 0 && (
                <TableEmpty colSpan={7} title=" Không có cuộc hẹn nào" />
              )}
            </TableBody>
            <TableCaption>Danh sách lịch xem phòng</TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointment;
