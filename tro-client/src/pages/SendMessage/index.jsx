import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AmenitiesList } from "@/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconLeft } from "react-day-picker";
import { SendMessageInfo } from "@/components/SendMessageInfo";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/helpers";
import { getListing } from "@/apis/listing";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import useUserStore from "@/hooks/useUserStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LazyLoadImage } from "react-lazy-load-image-component";

const FormSchema = z.object({
  message: z
    .string()
    .min(5, {
      message: "Tin nhắn phải nhiều hơn 5 ký tự.",
    })
    .max(200, {
      message: "Tin nhắn quá dài.",
    }),
});
const Index = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const { user, socketConnection } = useUserStore();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });
  useEffect(() => {
    (async () => {
      try {
        const { data, success } = await getListing(id);
        if (success) {
          setListing(data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);

  async function onSubmit(data) {
    try {
      if (socketConnection) {
        socketConnection.emit("newMessage", {
          sender: user?.id,
          senderName: user?.fullName ?? user?.username,
          listingId: listing?.id,
          receiver: listing?.user?.id,
          text: data.message,
          userId: user?.id,
        });
      }
      toast.success("Gửi tin nhắn thành công!");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="h-14 flex items-center px-4">
        <IconLeft />
      </div>
      <div className="grid md:grid-cols-6 md:gap-16 grid-cols-1 flex-col-reverse  ">
        <div className="col-span-4">
          <div className="flex justify-between py-6 border-b">
            <div>
              <p className="text-xl font-medium mb-2">
                Liên hệ {listing?.user?.fullName || listing?.user?.username}
              </p>
              <p className="text-muted-foreground">
                Thường phản hồi trong vòng 1 giờ
              </p>
            </div>
            <div className="relative">
              <Avatar className="size-16 border ">
                <AvatarImage src={listing?.user?.avatarUrl} />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 z-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 14"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  // style="display: block; height: 24px; width: 24px;"
                  style={{
                    height: "24px",
                    width: "24px",
                  }}
                >
                  <linearGradient
                    id="a"
                    x1="8.5%"
                    x2="92.18%"
                    y1="17.16%"
                    y2="17.16%"
                  >
                    <stop offset="0" stop-color="#e61e4d"></stop>
                    <stop offset=".5" stop-color="#e31c5f"></stop>
                    <stop offset="1" stop-color="#d70466"></stop>
                  </linearGradient>
                  <path
                    fill="#fff"
                    d="M9.93 0c.88 0 1.6.67 1.66 1.52l.01.15v2.15c0 .54-.26 1.05-.7 1.36l-.13.08-3.73 2.17a3.4 3.4 0 1 1-2.48 0L.83 5.26A1.67 1.67 0 0 1 0 3.96L0 3.82V1.67C0 .79.67.07 1.52 0L1.67 0z"
                  ></path>
                  <path
                    fill="url(#a)"
                    d="M5.8 8.2a2.4 2.4 0 0 0-.16 4.8h.32a2.4 2.4 0 0 0-.16-4.8zM9.93 1H1.67a.67.67 0 0 0-.66.57l-.01.1v2.15c0 .2.1.39.25.52l.08.05L5.46 6.8c.1.06.2.09.29.1h.1l.1-.02.1-.03.09-.05 4.13-2.4c.17-.1.3-.29.32-.48l.01-.1V1.67a.67.67 0 0 0-.57-.66z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <SendMessageInfo />
          <div className="border-t py-8">
            <h2 className="text-[22px] leading-[26px] font-semibold">
              Bạn vẫn còn thắc mắc? Nhắn tin cho Chủ nhà
            </h2>
            <div className="mt-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tin nhắn</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`Xin chào ${
                              listing?.user?.fullName || listing?.user?.username
                            }! Tôi sẽ ghé thăm...`}
                            className="text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="outline">
                    Gửi tin nhắn
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <Card className="col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Thông tin phòng cho thuê</CardTitle>
            <CardDescription>Phòng cho thuê</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-6">
              <div className="text-base">
                <p className="font-medium">{listing?.title}</p>
                <p className="text-muted-foreground text-xs">
                  {/* {listing?.address} */}
                  {`${listing?.location?.name}, ${listing?.location?.city}, ${listing?.location?.country}`}
                </p>
              </div>
              <div className="min-w-20">
                <LazyLoadImage
                  effect="blur"
                  src={listing?.images[0].url}
                  className="size-20 rounded-md"
                  alt=""
                />
              </div>
            </div>
            <div className="mt-4 ">
              <h3 className="font-semibold text-base mb-2">Giá phòng</h3>
              <div className="text-2xl">{formatCurrency(listing?.price)}</div>
            </div>
            <div className="mt-4 ">
              <h3 className="font-semibold text-base mb-2">Địa chỉ</h3>
              <div className="">{listing?.address}</div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-base  mb-2">Tiện ích</h3>
              <AmenitiesList listingAmenities={listing?.listingAmenities} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
