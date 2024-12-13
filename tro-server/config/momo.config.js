export const MomoConfig = {
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  partnerCode: "MOMO",
  partnerName: "TROVN",
  redirectUrl: "https://trovn.io.vn/payment/momo",
  ipnUrl: "https://manhcuong.id.vn" + "/api/v1/payment/momo/callback",
  // requestType: "linkWallet",
  // requestType: "",
  extraData: "",
  orderGroupId: "",
  autoCapture: true,
  lang: "vi",
};
