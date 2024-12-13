import * as React from "react";
import { useReactToPrint } from "react-to-print";

import { Contract } from "../Contract";
import { Button } from "../ui/button";
import { formatCurrency } from "@/utils/helpers";

const RentalContract = ({ onClose, address, price }) => {
  const componentRef = React.useRef(null);

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "AwesomeFileName",
    onAfterPrint: handleAfterPrint,
    onBeforePrint: handleBeforePrint,
  });

  return (
    <div>
      <Contract
        ref={componentRef}
        address={address}
        price={formatCurrency(price)}
      />
      <div className="mt-8 text-end px-10">
        <Button onClick={handlePrint}>In hợp đồng</Button>
      </div>
    </div>
  );
};
export default RentalContract;
