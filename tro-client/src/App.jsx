import { useCallback, useEffect, useState } from "react";

import { BiMessageAltDetail } from "react-icons/bi";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import dayjs from "dayjs";
import { io } from "socket.io-client";
import { notification } from "antd";
import { router } from "./routes/routes";
import { updateLatLngUser } from "./apis/user";
import useConversationStore from "./hooks/useConversationStore";
import useUserStore from "./hooks/useUserStore";
import { toast } from "sonner";
import utc from "dayjs/plugin/utc";
import vi from "dayjs/locale/vi";
import { Button } from "./components/ui/button";
import { ROLE } from "./constants/role";
import { Bell } from "lucide-react";
import useNotificationStore from "./hooks/useNotificationStore";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

dayjs.extend(utc);
dayjs.locale(vi);

function App() {
  const {
    user,
    setOnlineUser,
    setSocketConnection,
    socketConnection,
    setUser,
  } = useUserStore();
  const { setUnreadMessagesCount } = useConversationStore();
  const { updateNotifications } = useNotificationStore();
  const [api, contextHolder] = notification.useNotification();
  const TOKEN = JSON.parse(localStorage.getItem("token"));

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (!TOKEN) return;

    const socketInstance = io(BACKEND_URL, {
      auth: { token: `Bearer ${TOKEN}` },
      timeout: 16000,
    });

    setSocketConnection(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    socketInstance.on("onlineUser", (data) => {
      setOnlineUser(data);
    });

    if (user && user.id) {
      socketInstance.emit("unreadMessagesCount", user.id);
    }

    socketInstance.on("unreadMessagesCount", (count) => {
      setUnreadMessagesCount(count);
    });

    socketInstance.on("newMessageNotification", ({ senderName, text }) => {
      playNotificationSound();
      api.open({
        message: (
          <div className="text-xs">
            {`Bạn nhận được tin nhắn mới từ `}
            <strong>{senderName}</strong>
          </div>
        ),
        description: text,
        icon: <BiMessageAltDetail />,
      });
    });

    if (user?.role === ROLE.HOST) {
      socketInstance.on("broadcastHostMessage", (data) => {
        playNotificationSound();
        alert(`broadcastHostMessage: ${data.text}`);
      });
    }

    if (user?.role === ROLE.USER) {
      socketInstance.on("broadcastUserMessage", (data) => {
        playNotificationSound();
        alert(`broadcastUserMessage: ${data.text}`);
      });
    }

    socketInstance.on("notification", (data) => {
      playNotificationSound();
      updateNotifications(data.data);
      api.open({
        message: (
          <div className="text-base font-semibold">{data.data.title}</div>
        ),
        description: data.data.message,
        icon: <Bell />,
      });
    });

    // socketInstance.on("error", (data) => {
    //   playNotificationSound();
    //   updateNotifications(data.data);
    //   api.open({
    //     message: <div className="text-base font-semibold">{data.data}</div>,
    //     description: data.data,
    //     icon: <Bell />,
    //   });
    // });

    // socketInstance.on("error", (errorMessage) => {
    //   toast.error(errorMessage, { position: "top-center" });
    // });

    return () => {
      socketInstance.disconnect();
    };
  }, [
    TOKEN,
    api,
    setOnlineUser,
    setSocketConnection,
    setUnreadMessagesCount,
    user,
  ]);

  useEffect(() => {
    const updateLocation = async () => {
      if (
        location.latitude !== null &&
        location.longitude !== null &&
        user?.latitude === null
      ) {
        const { data, success } = await updateLatLngUser(
          location.latitude,
          location.longitude
        );
        if (success) {
          setUser(data);
        }
      }
    };
    updateLocation();
  }, [location.latitude, location.longitude, user, setUser]);

  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (user?.latitude === null && user?.longitude === null) {
      handleGetLocation();
    }
  }, [user, handleGetLocation]);

  const playNotificationSound = () => {
    const audio = new Audio("/message2.mp3");
    audio.play();
  };

  const helloHost = () => {
    socketConnection.emit("broadcastHostMessage", "Hello HOST");
  };

  const helloUser = () => {
    socketConnection.emit("broadcastUserMessage", "Hello USER");
  };

  return (
    <>
      {contextHolder}
      <Toaster />
      {/* <Button onClick={helloHost}>CLICK helloHost</Button>
      <Button onClick={helloUser}>CLICK helloUser</Button> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
