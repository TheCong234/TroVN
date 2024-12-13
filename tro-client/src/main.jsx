import "@/assets/css/index.css";
import "@/assets/css/fonts.css";

import App from "@/App";
import { ConfigProvider } from "antd";
import { ModalProvider } from "./providers/ModalProvider";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import "react-lazy-load-image-component/src/effects/blur.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        // fontFamily: '"Airbnb", sans-serif',
        borderRadius: 8,
        fontWeightStrong: 500,
        colorText: "#222",
        colorPrimary: "hsl(346.8 77.2% 49.8%)",
      },
    }}
  >
    <Toaster />
    <ModalProvider />
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </ConfigProvider>
);
