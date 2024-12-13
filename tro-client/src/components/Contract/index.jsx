import React, { useState } from "react";

export const Contract = React.forwardRef(({ address, price }, ref) => {
  const [tenantName, setTenantName] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [landlordId, setLandlordId] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [rentalPeriod, setRentalPeriod] = useState("");
  const [rentalPrice, setRentalPrice] = useState(price || null);
  const [depositAmount, setDepositAmount] = useState(null);
  const [extensionDetails, setExtensionDetails] = useState([
    { number: "", duration: "", from: "", to: "", price: "" },
  ]);

  const handleAddExtension = () => {
    setExtensionDetails([
      ...extensionDetails,
      { number: "", duration: "", from: "", to: "", price: "" },
    ]);
  };

  const handleChangeExtension = (index, field, value) => {
    const updatedExtensions = [...extensionDetails];
    updatedExtensions[index][field] = value;
    setExtensionDetails(updatedExtensions);
  };

  return (
    <div
      ref={ref}
      style={{ fontFamily: "Times New Roman, sans-serif" }}
      className="container px-10 contract-template"
    >
      <h2 className="text-center  font-semibold text-xl">
        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
      </h2>
      <h3 className="text-center">Độc lập – Tự do – Hạnh phúc</h3>
      <h2 className="text-2xl text-center font-semibold my-2">
        HỢP ĐỒNG THUÊ PHÒNG TRỌ
      </h2>
      <p className="text-end">
        Hôm nay, ngày......... tháng ….. năm 20…., tại căn nhà số{" "}
        {propertyAddress}.
      </p>
      <h3 className="font-semibold">
        BÊN CHO THUÊ PHÒNG TRỌ (gọi tắt là Bên A):
      </h3>
      <p>
        Ông/bà (tên chủ hợp đồng):{" "}
        <input
          type="text"
          value={landlordName}
          placeholder="........................................................"
          onChange={(e) => setLandlordName(e.target.value)}
        />
      </p>
      <p>
        CMND/CCCD số:{" "}
        <input
          type="text"
          value={landlordId}
          placeholder="........................................................"
          onChange={(e) => setLandlordId(e.target.value)}
        />
      </p>
      <p>
        Thường trú tại:{" "}
        <input
          type="text"
          value={propertyAddress}
          placeholder="........................................................"
          onChange={(e) => setPropertyAddress(e.target.value)}
        />
      </p>
      <h3 className="font-semibold">BÊN THUÊ PHÒNG TRỌ (gọi tắt là Bên B):</h3>
      <p>
        Ông/bà:{" "}
        <input
          type="text"
          placeholder="........................................................"
          value={tenantName}
          onChange={(e) => setTenantName(e.target.value)}
        />
      </p>
      <p>
        CMND/CCCD số:{" "}
        <input
          placeholder="........................................................"
          type="text"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
        />
      </p>
      <p>
        Thường trú tại:{" "}
        <input
          type="text"
          placeholder="........................................................"
        />
      </p>
      <p className="italic font-semibold">
        Sau khi thỏa thuận, hai bên thống nhất như sau:
      </p>
      <h3 className="font-semibold">1. Nội dung thuê phòng trọ:</h3>
      <p>
        Bên A cho Bên B thuê 01 phòng trọ số............. tại căn nhà số{" "}
        {propertyAddress}.
      </p>
      <p>
        Với thời hạn là:{" "}
        <input
          className="w-[30px]"
          type="text"
          placeholder="........................................................"
          value={rentalPeriod}
          onChange={(e) => setRentalPeriod(e.target.value)}
        />{" "}
        tháng, giá thuê:{" "}
        <input
          type="text"
          value={rentalPrice}
          placeholder="........................................................"
          className="w-[100px]"
          onChange={(e) => setRentalPrice(e.target.value)}
        />{" "}
        đồng.
      </p>
      <p>Chưa bao gồm chi phí: điện sinh hoạt, nước.</p>
      <h3 className="font-semibold">2. Trách nhiệm Bên A:</h3>
      <p> Đảm bảo căn nhà cho thuê không có tranh chấp, khiếu kiện.</p>
      <p>Đăng ký với chính quyền địa phương về thủ tục cho thuê phòng trọ.</p>
      <h3 className="font-semibold">3. Trách nhiệm Bên B:</h3>
      <p>
        Đặt cọc với số tiền là{" "}
        <input
          type="text"
          value={depositAmount}
          className="w-[100px]"
          placeholder="........................................................"
          onChange={(e) => setDepositAmount(e.target.value)}
        />{" "}
        đồng.
      </p>
      <p>
        Thanh toán tiền thuê phòng hàng tháng vào ngày ……. + tiền điện + nước.
      </p>
      <p>
        Đảm bảo các thiết bị và sửa chữa các hư hỏng trong phòng trong khi sử
        dụng. Nếu không sửa chữa thì khi trả phòng, bên A sẽ trừ vào tiền đặt
        cọc, giá trị cụ thể được tính theo giá thị trường.
      </p>
      <p>
        Chỉ sử dụng phòng trọ vào mục đích ở, với số lượng tối đa không quá 04
        người (kể cả trẻ em); không chứa các thiết bị gây cháy nổ, hàng cấm...
        cung cấp giấy tờ tùy thân để đăng ký tạm trú theo quy định, giữ gìn an
        ninh trật tự, nếp sống văn hóa đô thị; không tụ tập nhậu nhẹt, cờ bạc và
        các hành vi vi phạm pháp luật khác.
      </p>
      <p>
        Không được tự ý cải tạo kiếm trúc phòng hoặc trang trí ảnh hưởng tới
        tường, cột, nền... Nếu có nhu cầu trên phải trao đổi với bên A để được
        thống nhất
      </p>
      <h3 className="font-semibold">4. Điều khoản thực hiện:</h3>
      <p>
        Hai bên nghiêm túc thực hiện những quy định trên trong thời hạn cho
        thuê, nếu bên A lấy phòng phải báo cho bên B ít nhất 01 tháng, hoặc
        ngược lại.
      </p>
      <p>
        Sau thời hạn cho thuê ….. tháng nếu bên B có nhu cầu hai bên tiếp tục
        thương lượng giá thuê để gia hạn hợp đồng bằng miệng hoặc thực hiện như
        sau.
      </p>
      <button onClick={handleAddExtension}>Thêm gia hạn</button>
      <div className="flex justify-around">
        <div>
          <p className="text-center font-semibold">
            Bên B <br /> (Ký, ghi rõ họ tên)
          </p>
        </div>
        <div>
          <p className="text-center font-semibold">
            Bên A <br /> (Ký, ghi rõ họ tên)
          </p>
        </div>
      </div>
    </div>
  );
});
