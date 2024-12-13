import { TableCell } from "../ui/table";

export const TableEmpty = ({ colSpan, title }) => {
  return (
    <TableCell
      colSpan={colSpan}
      className="bg-secondary text-center font-semibold text-lg py-10 text-secondary-foreground"
    >
      {title}
    </TableCell>
  );
};
