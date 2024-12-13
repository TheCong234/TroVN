import { LazyLoader } from "@/commons";
import { MessagePage } from "@/components";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const WithdrawalRequest = lazy(() => import("@/pages/Host/WithdrawalRequest"));
const CreateInvoice = lazy(() => import("@/pages/Host/Invoice/CreateInvoice"));
const HomeBlog = lazy(() => import("@/pages/Blog/HomeBlog"));
const BlogDetail = lazy(() => import("@/pages/Blog/BlogDetail"));
const InvoiceList = lazy(() => import("@/pages/Host/Invoice/InvoiceList"));
const Invoice = lazy(() => import("@/pages/Host/Invoice"));
const Invoices = lazy(() => import("@/pages/Invoices"));
const AdminLayout = lazy(() => import("@/pages/Layout/AdminLayout"));
const AdvertiseManager = lazy(() => import("@/pages/Host/AdvertiseManager"));
const Appointment = lazy(() => import("@/pages/Appointment"));
const Chat = lazy(() => import("@/pages/Chat"));
const ChatPageMobile = lazy(() => import("@/pages/Chat/ChatPageMobile"));
const Chatbot = lazy(() => import("@/pages/Chatbot"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const EmptyLayout = lazy(() => import("@/pages/Layout/EmptyLayout"));
const Favorite = lazy(() => import("@/pages/Favorite"));
const Forgot = lazy(() => import("@/pages/Forgetpass"));
const Home = lazy(() => import("@/pages/Home"));
const HomeGuide = lazy(() => import("@/pages/HomeGuide"));
const HostAppointment = lazy(() => import("@/pages/Host/Appointment"));
const HostLayout = lazy(() => import("@/pages/Layout/HostLayout"));
const BlogLayout = lazy(() => import("@/pages/Layout/BlogLayout"));
const HostLayoutV2 = lazy(() => import("@/pages/Layout/HostLayoutV2"));
const HostRentedRoom = lazy(() => import("@/pages/Host/HostRentedRoom"));
const Info = lazy(() => import("@/pages/Info"));
const Listing = lazy(() => import("@/pages/Listing"));
const Login = lazy(() => import("@/pages/Login"));
const Logout = lazy(() => import("@/pages/Logout"));
const MainLayout = lazy(() => import("@/pages/Layout/MainLayout"));
const Momo = lazy(() => import("@/pages/Payment/Momo"));
const NewInfo = lazy(() => import("@/pages/User/Info"));
const Newpass = lazy(() => import("@/pages/Newpass"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Payment = lazy(() => import("@/pages/User/Setting/Payment"));
const PersonalInfo = lazy(() => import("@/pages/User/Setting/PersonalInfo"));
const Register = lazy(() => import("@/pages/Register"));
const RentedRoom = lazy(() => import("@/pages/RentedRoom"));
const RentedRoomDetail = lazy(() =>
  import("@/pages/RentedRoom/RentedRoomDetail")
);
const Reports = lazy(() => import("@/pages/Admin/Reports"));
const Search = lazy(() => import("@/pages/Search"));
const Security = lazy(() => import("@/pages/User/Setting/Security"));
const SendMessage = lazy(() => import("@/pages/SendMessage"));
const Services = lazy(() => import("@/pages/Host/Services"));
const Setting = lazy(() => import("@/pages/User/Setting"));
const VNPay = lazy(() => import("@/pages/Payment/VNPay"));
const Welcome = lazy(() => import("@/pages/Welcome"));

// Admin routes
const Amenities = lazy(() => import("@/pages/Admin/Amenities"));
const Banners = lazy(() => import("@/pages/Admin/Banners"));
const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
const Listings = lazy(() => import("@/pages/Admin/Listings"));
const Locations = lazy(() => import("@/pages/Admin/Locations"));
const Payments = lazy(() => import("@/pages/Admin/Payments"));
const Users = lazy(() => import("@/pages/Admin/Users"));
const Blog = lazy(() => import("@/pages/Admin/Blog"));
const Notifications = lazy(() => import("@/pages/Admin/Notifications"));
const WithdrawalRequestAdmin = lazy(() =>
  import("@/pages/Admin/WithdrawalRequest")
);

// Host routes
const ListingCreate = lazy(() => import("@/pages/Host/Listing/ListingCreate"));
const ListingList = lazy(() => import("@/pages/Host/Listing/ListingList"));
const HostDashboard = lazy(() => import("@/pages/Host/Dashboard"));
const Notification = lazy(() => import("@/pages/Notification"));

export const router = createBrowserRouter([
  {
    path: "",
    element: <LazyLoader element={<EmptyLayout />} />,
    children: [
      {
        path: "/register",
        element: <LazyLoader element={<Register />} />,
      },
      {
        path: "/login",
        element: <LazyLoader element={<Login />} />,
      },
      {
        path: "/forgot",
        element: <LazyLoader element={<Forgot />} />,
      },
      {
        path: "/chatbot",
        element: <LazyLoader element={<Chatbot />} />,
      },
      {
        path: "/newpass",
        element: <LazyLoader element={<Newpass />} />,
      },
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "", element: <LazyLoader element={<Home />} /> },
          { path: ":token", element: <LazyLoader element={<Home />} /> },
          {
            path: "/listing/:id",
            element: <LazyLoader element={<Listing />} />,
          },
          { path: "/search", element: <LazyLoader element={<Search />} /> },
          { path: "/checkout", element: <LazyLoader element={<Checkout />} /> },
          { path: "/invoices", element: <LazyLoader element={<Invoices />} /> },
          {
            path: "/notification",
            element: <LazyLoader element={<Notification />} />,
          },
          {
            path: "/appointment",
            element: <LazyLoader element={<Appointment />} />,
          },
          {
            path: "rented-room",
            element: <EmptyLayout />,
            children: [
              {
                path: ":id",
                element: <LazyLoader element={<RentedRoomDetail />} />,
              },
              {
                path: "room",
                element: <LazyLoader element={<RentedRoom />} />,
              },
            ],
          },
          {
            path: "/listing/contact-host/:id",
            element: <LazyLoader element={<SendMessage />} />,
          },
          // { path: "/user/info", element: <NewInfo /> },
          {
            path: "/chat",
            element: <LazyLoader element={<Chat />} />,
            children: [
              {
                path: "",
                element: <LazyLoader element={<Welcome />} />,
              },

              {
                path: ":id",
                element: <LazyLoader element={<MessagePage />} />,
              },
            ],
          },
          {
            path: "/message/:id",
            element: <LazyLoader element={<ChatPageMobile />} />,
          },
          {
            path: "/user",
            element: <EmptyLayout />,
            children: [
              { path: "info/:id", element: <LazyLoader element={<Info />} /> },
              {
                path: "new-info/:id",
                element: <LazyLoader element={<NewInfo />} />,
              },
            ],
          },
          {
            path: "/account-settings",
            element: <LazyLoader element={<Setting />} />,
            // children: [
            //     {
            //         path: "personal-info",
            //         element: <PersonalInfo />,
            //     },
            // ],
          },
          {
            path: "/account-settings/personal-info",
            element: <LazyLoader element={<PersonalInfo />} />,
          },
          {
            path: "/account-settings/payment",
            element: <LazyLoader element={<Payment />} />,
          },
          {
            path: "/account-settings/login-and-security",
            element: <LazyLoader element={<Security />} />,
          },
          { path: "/favorite", element: <LazyLoader element={<Favorite />} /> },
          { path: "logout", element: <LazyLoader element={<Logout />} /> },
          {
            path: "/payment/vnpay",
            element: <LazyLoader element={<VNPay />} />,
          },
          { path: "/payment/momo", element: <LazyLoader element={<Momo />} /> },
          {
            path: "/homes/guide",
            element: <LazyLoader element={<HomeGuide />} />,
          },
          {
            path: "*",
            element: <LazyLoader element={<NotFound />} />,
          },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <LazyLoader element={<AdminLayout />} />,
    children: [
      {
        path: "",
        element: <LazyLoader element={<Dashboard />} />,
      },
      {
        path: "listings",
        element: <LazyLoader element={<Listings />} />,
      },
      {
        path: "banners",
        element: <LazyLoader element={<Banners />} />,
      },
      {
        path: "locations",
        element: <LazyLoader element={<Locations />} />,
      },
      {
        path: "amenities",
        element: <LazyLoader element={<Amenities />} />,
      },
      {
        path: "users",
        element: <LazyLoader element={<Users />} />,
      },
      {
        path: "payments",
        element: <LazyLoader element={<Payments />} />,
      },
      {
        path: "reports",
        element: <LazyLoader element={<Reports />} />,
      },
      {
        path: "blogs",
        element: <LazyLoader element={<Blog />} />,
      },
      {
        path: "withdrawal-request",
        element: <LazyLoader element={<WithdrawalRequestAdmin />} />,
      },
      {
        path: "notifications",
        element: <LazyLoader element={<Notifications />} />,
      },
      {
        path: "chat",
        element: <LazyLoader element={<Chat />} />,
        children: [
          {
            path: "",
            element: <LazyLoader element={<Welcome />} />,
          },
          { path: ":id", element: <LazyLoader element={<MessagePage />} /> },
        ],
      },
    ],
  },

  // {
  //   path: "/host",
  //   element: <LazyLoader element={<HostLayout />} />,
  //   children: [
  //     {
  //       path: "",
  //       element: <LazyLoader element={<Services />} />,
  //     },
  //     {
  //       path: "ads-package",
  //       element: <LazyLoader element={<AdvertiseManager />} />,
  //     },

  //     {
  //       path: "listing",
  //       element: <LazyLoader element={<EmptyLayout />} />,
  //       children: [
  //         {
  //           path: "list",
  //           element: <LazyLoader element={<ListingList />} />,
  //         },
  //         {
  //           path: "create",
  //           element: <LazyLoader element={<ListingCreate />} />,
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    path: "/host/v2",
    element: <LazyLoader element={<HostLayoutV2 />} />,
    children: [
      {
        path: "",
        element: <LazyLoader element={<HostDashboard />} />,
      },
      {
        path: "ads-package-list",
        element: <LazyLoader element={<Services />} />,
      },
      {
        path: "rented-room",
        element: <LazyLoader element={<HostRentedRoom />} />,
      },
      {
        path: "ads-package",
        element: <LazyLoader element={<AdvertiseManager />} />,
      },
      {
        path: "appointments",
        element: <LazyLoader element={<HostAppointment />} />,
      },
      {
        path: "invoice-list",
        element: <LazyLoader element={<InvoiceList />} />,
      },
      {
        path: "invoice-create",
        element: <LazyLoader element={<CreateInvoice />} />,
      },
      {
        path: "withdrawal-request",
        element: <LazyLoader element={<WithdrawalRequest />} />,
      },
      {
        path: "listing",
        element: <LazyLoader element={<EmptyLayout />} />,
        children: [
          {
            path: "list",
            element: <LazyLoader element={<ListingList />} />,
          },
          {
            path: "create",
            element: <LazyLoader element={<ListingCreate />} />,
          },
        ],
      },
      {
        path: "*",
        element: <LazyLoader element={<NotFound />} />,
      },
    ],
  },
  {
    path: "blogs",
    element: <BlogLayout />,
    children: [
      {
        path: "",
        element: <LazyLoader element={<HomeBlog />} />,
      },
      {
        path: ":slug",
        element: <LazyLoader element={<BlogDetail />} />,
      },
    ],
  },
]);
