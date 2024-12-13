/* eslint-disable react/prop-types */
import { LazyLoadImage } from "react-lazy-load-image-component";

const Index = ({ listingAmenities }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {listingAmenities?.map((item) => (
        <div key={item.id} className="flex gap-4">
          <div>
            <LazyLoadImage
              effect="blur"
              src={item.amenity.iconUrl}
              alt={item.amenity.name}
              className="w-6 h-6"
            />
          </div>
          <div className="text-base leading-5">{item.amenity.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Index;
