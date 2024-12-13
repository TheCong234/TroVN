import { STATUS_COLOR } from "@/enums";
import { clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatMoney = (amount) => {
  if (!amount && amount !== 0) {
    return null;
  }

  if (amount >= 1e6) {
    let millions = amount / 1e6;
    millions = millions.toFixed(2);
    return millions + " triệu";
  } else if (amount >= 1e5) {
    let hundredsOfThousands = amount / 1e5;
    hundredsOfThousands = hundredsOfThousands.toFixed(0);
    return hundredsOfThousands + " trăm";
  } else if (amount >= 1e3) {
    let thousands = amount / 1e3;
    thousands = thousands.toFixed(0);
    return thousands + " nghìn";
  } else {
    return amount + " đồng";
  }
};

export const formatCurrency = (number) => {
  return parseFloat(number)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
};

export const getTerm = (term) => {
  switch (term) {
    case "BOTH":
      return "Cho thuê ngắn hạn và dài hạn";
    case "LONG":
      return "Cho thuê dài hạn";
    case "SHORT":
      return "Cho thuê ngắn hạn";
    default:
      break;
  }
};

export const convertArrayToFiles = (files) => {
  console.log(files);

  return files.map((file) => {
    const fileObj = new File([file], file.name, { type: file.type });
    return fileObj;
  });
};

export const formatDateCount = (data) => {
  return moment(data).startOf("day").fromNow();
};

function getTimeDifference(dateString) {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = currentDate - inputDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days} ngày trước`;
  } else if (hours > 0) {
    return `${hours} giờ trước`;
  } else if (minutes > 0) {
    return `${minutes} phút trước`;
  } else {
    return `${seconds} giây trước`;
  }
}

const getStatusColor = (status) => STATUS_COLOR[status] || "default";

const formatDuration = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const duration = moment.duration(end.diff(start));

  let formattedDuration = "";
  const days = duration.asDays();
  const months = duration.asMonths();
  const years = duration.asYears();

  if (years >= 1) {
    formattedDuration = `${Math.floor(years)} năm`;
  } else if (months > 5) {
    formattedDuration = `${Math.floor(months + 1)} tháng`;
  } else if (months >= 1) {
    formattedDuration = `${Math.floor(months)} tháng`;
  } else if (days >= 1) {
    formattedDuration = `${Math.floor(days)} ngày`;
  } else {
    formattedDuration = `Chưa cập nhật`;
  }

  return formattedDuration;
};

export { getTimeDifference, getStatusColor, formatDuration };
