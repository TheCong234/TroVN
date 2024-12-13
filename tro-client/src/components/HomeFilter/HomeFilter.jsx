import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import useLocationStore from "@/hooks/useLocationStore";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command";
import { Map, User } from "lucide-react";
import useListingStore from "@/hooks/useListingStore";
import useAmenityStore from "@/hooks/useAmenityStore";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { formatMoney } from "@/utils/helpers";

export const HomeFilter = ({ handleClickItem, amenityIds }) => {
  const { locations, setLocations } = useLocationStore();
  const { amenities } = useAmenityStore();
  const { setListingLocationId, updateSearchListings } = useListingStore();
  const [selectedLocation, setSelectedLocation] = useState(null);
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
  };

  return (
    <div className="flex justify-center gap-4 py-2 bg-white border-b">
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="mr-10">
                {selectedLocation
                  ? `${selectedLocation.name} - ${selectedLocation.country} `
                  : "Bạn muốn tìm phòng ở đâu?"}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:w-[600px]">
                <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                  <CommandInput
                    placeholder={
                      selectedLocation
                        ? `${selectedLocation.name} ${selectedLocation.city} `
                        : "Nhập địa chỉ..."
                    }
                  />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy địa chỉ.</CommandEmpty>
                    <CommandGroup heading="Danh sách địa chỉ">
                      {locations?.map((location) => (
                        <CommandItem
                          key={location.id}
                          className="cursor-pointer"
                        >
                          <Map />
                          <span
                            onClick={() => {
                              setListingLocationId(location.id);
                              setSelectedLocation(location);
                            }}
                          >{`${location.name} ${location.city} ${location.country}`}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="mr-10">
                {amenityIds?.length > 0
                  ? `${amenityIds?.length} tiện ích`
                  : "Tiện ích phòng?"}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:w-[600px]">
                <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                  <CommandInput
                    placeholder={
                      selectedLocation
                        ? `${selectedLocation.name} ${selectedLocation.city} `
                        : "Chọn danh các tiện ích"
                    }
                  />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy địa chỉ.</CommandEmpty>
                    <CommandGroup heading="Danh sách tiện ích">
                      {amenities.map((amenity) => (
                        <CommandItem
                          key={amenity.id}
                          className={cn(
                            "cursor-pointer",
                            amenityIds?.includes(amenity.id) && "font-semibold"
                          )}
                        >
                          <img
                            src={amenity.iconUrl}
                            className="size-6"
                            alt=""
                          />
                          <span
                            onClick={() => {
                              handleClickItem(amenity.id);
                            }}
                          >{`${amenity.name}`}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="mr-10">
                Giá phòng
              </NavigationMenuTrigger>
              <NavigationMenuContent className="md:w-[600px]">
                <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                  <CommandInput
                    placeholder={
                      selectedLocation
                        ? `${selectedLocation.name} ${selectedLocation.city} `
                        : "Chọn danh các tiện ích"
                    }
                  />
                  <CommandList>
                    {/* <CommandEmpty>Không tìm thấy địa chỉ.</CommandEmpty> */}
                    <CommandGroup heading="Khoảng giá">
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
                    </CommandGroup>
                  </CommandList>
                </Command>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
