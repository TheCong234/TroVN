import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { formatCurrency, formatMoney } from "@/utils/helpers";

import { Button } from "../ui/button";
import { MODAL_TYPE } from "@/enums";
import { PriceRange } from "..";
import { Slider } from "antd";
import { Toggle } from "../ui/toggle";
import useListingStore from "@/hooks/useListingStore";
import { useModal } from "@/hooks/useModalStore";
import { useState } from "react";

export const FilterModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { updateSearchListings } = useListingStore();
  const [priceRange, setPriceRange] = useState([
    { min: 0, max: 5000000 },
    { min: 5000000, max: 10000000 },
    { min: 10000000, max: 15000000 },
    { min: 15000000, max: 20000000 },
    { min: 20000000, max: undefined },
  ]);
  const handlePriceChange = (range) => {
    updateSearchListings("minPrice", range.min);
    updateSearchListings("maxPrice", range.max);
    onClose();
  };
  const isModalOpen = isOpen && type === MODAL_TYPE.LISTING_FILTER_MODAL;
  const { amenities } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="pb-4">Bộ lọc</DialogTitle>
          <DialogDescription>
            <div>
              <h3>Giá phòng</h3>
              <ToggleGroup
                type="single"
                className="flex flex-wrap justify-start"
                onValueChange={handlePriceChange}
              >
                {priceRange.map((range) => (
                  <ToggleGroupItem
                    value={range}
                    className="font-semibold text-muted-foreground"
                  >
                    {formatMoney(range.min)} -{" "}
                    {formatMoney(range.max) || "Trên 20 triệu"}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Thoát
          </Button>
          <Button>Tìm kiếm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
