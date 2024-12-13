import { DatePicker, Badge, Calendar } from "antd"; // Import DatePicker từ antd
import { useEffect, useState } from "react";
import { getAllAppointments } from "@/apis/appointment";
import { useModal } from "@/hooks/useModalStore";
import { MODAL_TYPE } from "@/enums";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    fromDate: undefined,
    toDate: undefined,
    reload: false,
  });

  const { isOpen, onClose, onOpen } = useModal();

  const handleReload = () => {
    setFilters({
      ...filters,
      reload: !filters.reload,
    });
  };

  const onDateChange = (dates) => {
    if (dates) {
      setFilters({
        ...filters,
        fromDate: dates[0].startOf("day").format("YYYY-MM-DD"),
        toDate: dates[1].endOf("day").format("YYYY-MM-DD"),
      });
    } else {
      setFilters({
        ...filters,
        fromDate: undefined,
        toDate: undefined,
      });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const { page, limit, fromDate, toDate } = filters;
      try {
        const { success, data, message } = await getAllAppointments(
          page,
          limit,
          fromDate,
          toDate
        );
        if (success) {
          setAppointments(data);
        } else {
          console.log("Failed to fetch appointments:", message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [filters]);

  const getListData = (value) => {
    const dateString = value.format("YYYY-MM-DD");
    const listData = appointments
      .filter(
        (appointment) =>
          appointment.appointmentDate.split("T")[0] === dateString
      )
      .map((appointment) => ({
        type: appointment.status.toLowerCase(),
        address: appointment.listing.address?.slice(0, -1),
      }));
    return listData || [];
  };

  const handleShowDetail = (value) => {
    const dateString = value.format("YYYY-MM-DD");
    const appointmentsForSelectedDate = appointments.filter(
      (appointment) => appointment.appointmentDate.split("T")[0] === dateString
    );

    onOpen(MODAL_TYPE.DETAIL_APPOINTMENT_MODAL, {
      appointments: appointmentsForSelectedDate,
      handleReload: handleReload,
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events " onClick={() => handleShowDetail(value)}>
        {listData.map((item, index) => (
          <div key={index}>
            <li className="!list-decimal mb-2 border-b text-[10px]  ">
              {item.address}
            </li>
          </div>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <div className="container">
      <Breadcrumb className="py-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lịch xem phòng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-semibold text-xl">Lịch xem phòng</h1>
      <Calendar
        headerRender={() => (
          <div className="flex justify-end">
            <div>
              <h2 className="font-semibold text-lg mb-2">Khoảng thời gian</h2>
              <DatePicker.RangePicker
                onChange={onDateChange}
                className="mb-4"
              />
            </div>
          </div>
        )}
        cellRender={cellRender}
      />
    </div>
  );
};

export default Appointment;
