import { Button, Form, Input, Modal, Space, Table } from "antd";
import {
  createAmenity,
  deleteAmenityById,
  getAllAmenity,
} from "@/apis/amenities";
import { useEffect, useState } from "react";

import { BiAddToQueue } from "react-icons/bi";
import { FcAddColumn } from "react-icons/fc";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadV1 } from "@/apis/image";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState(null);
  const [reload, setReload] = useState(false);
  const [amenityData, setAmenityData] = useState({
    iconUrl: null,
    name: "",
    description: "",
  });
  // ? : fetch data
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllAmenity();
        if (data) {
          setAmenities(data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [reload]);

  const handleChange = (name, e) => {
    setAmenityData((prev) => ({
      ...prev,
      [name]: e?.target?.value,
    }));
  };

  const handleUploadImage = async (e) => {
    try {
      const file = e.target.files[0];
      const { data, message, success } = await uploadV1(file);
      console.log(data);
      if (data) {
        setAmenityData((prev) => ({
          ...prev,
          iconUrl: data.data.url,
        }));
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const handleAddAmenity = async () => {
    try {
      setLoading(true);
      const { data, success, message } = await createAmenity(amenityData);
      setAmenityData(null);
      if (success) {
        setReload(!reload);
        toast.success(message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const data = await deleteAmenityById(id);
      if (data.status === 204) {
        setReload(!reload);
        toast.success("Xóa thành công");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Tiện ích",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hinh  ảnh",
      key: "iconUrl",
      dataIndex: "iconUrl",
      render: (iconUrl) => (
        <>
          <LazyLoadImage
            effect="blur"
            className="size-10"
            src={iconUrl}
            alt="icon"
          />
        </>
      ),
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, { id }) => (
        <div size="middle" title="Xóa" onClick={() => handleDelete(id)}>
          <TrashIcon className="hover:text-red-500 cursor-pointer" />
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="flex justify-between">
          <h1 className=" text-lg">Tiện ích phòng</h1>
          <Button
            className="text-base"
            type="default"
            onClick={() => setIsModalOpen(true)}
          >
            Thêm mới
            <FcAddColumn size={18} />
          </Button>
        </div>
        <div className="mt-4">
          <Table columns={columns} dataSource={amenities} />
        </div>
      </div>
      <Modal
        title="Thêm tiện ích"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={
          <div className="flex gap-2 justify-end gap-2">
            <Button type="text" onClick={() => setIsModalOpen(false)}>
              Thoát
            </Button>
            <Button type="primary" onClick={handleAddAmenity} loading={loading}>
              Xác nhận
            </Button>
          </div>
        }
      >
        <Form className="grid gap-y-2 my-6">
          <div>
            <label>Tên tiện ích</label>
            <Input
              value={amenityData?.name}
              onChange={(e) => handleChange("name", e)}
            />
          </div>
          <div>
            <label>Mô tả tiện ích (optional)</label>
            <Input
              value={amenityData?.description}
              onChange={(e) => handleChange("description", e)}
            />
          </div>
          <div>
            <label>Icon</label>
            <Input type="file" onChange={handleUploadImage} />
            {amenityData?.iconUrl && (
              <LazyLoadImage
                effect="blur"
                src={amenityData.iconUrl}
                alt="icon"
              />
            )}
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
