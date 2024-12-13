export const UserV1 = {
  CREATE_USER: "/user",
  GET_CURRENT_USER: "/user",
  GET_USER: "/user/:id",
  UPDATE_USER: "/user/",
  UPDATE_USER_AVATAR: "/user/avatar/",
  DELETE_USER: "/user/",
  GET_USERS: "/users",
  USER_LOGIN: "/user/login",
  GET_USER_OTP: "/user/otp",
  GET_VERIFY_EMAIL_OTP: "/user/verify",
  GET_REFRESH_TOKEN: "/user/refresh-token",
  GET_BALANCE: "/user/balance",
};

export const AmenityV1 = {
  CREATE_AMENITY: "/amenity",
  GET_ALL_AMENITY: "/amenities",
  REMOVE_AMENITY: "/amenity/",
};

export const ListingV1 = {
  GET_LISTING: "/listings",
  GET_LISTING_FOR_ME: "/listings/for-user",
  GET_LISTING_BY_ID: "/listing/",
  GET_LISTING_RECOMMENDATIONS: "/listings/recommendations",
  CREATE_LISTING: "/listing",
  GET_LISTING_BY_USER_ID: "/listing/user/",
  UPDATE_LISTING: "/listing/",
};

export const LocationV1 = {
  CREATE_LOCATION: "/location",
  GET_LOCATIONS: "/locations",
};

export const AdvertisingV1 = {
  GET_ALL_ADVERTISING: "/advertising-packages",
};

export const PaymentV1 = {
  GET_MOMO_PAYMENT: "/payment/momo",
  GET_VNPAY_PAYMENT: "/payment/vnpay",
  GET_PAYMENTS_BY_STATUS: "/payments",
  GET_PAYMENT_USER: "/payment/user",
  DELETE_PAYMENT: "/payment/",
};

export const OrderV1 = {
  GET_ORDERS_BY_USER: "/orders",
};

export const BannerV1 = {
  CREATE_BANNER: "/banner",
  GET_BANNERS: "/banners",
  GET_BANNERS_ACTIVE: "/banners/active",
  UPDATE_BANNER_STATUS: "/banners",
};

export const TagV1 = {
  GET_TAGS: "/tag",
};

export const ConversationV1 = {
  GET_CONVERSATIONS: "/conversation",
};

export const FavoriteV1 = {
  CREATE_FAVORITE: "/favorite",
  GET_FAVORITES: "/favorites",
  DELETE_FAVORITE: "/favorite",
};
export const AnalyticsV1 = {
  GET_ANALYTICS_NEW_LISTING: "/analytics/new-listing",
  GET_ANALYTICS_AMOUNT_PAYMENT: "/analytics/amount-payment",
  GET_ANALYTICS_NEW_USER_REGISTER: "/analytics/new-user-register",
  GET_ANALYTICS_LOCATION_COUNT_LISTING: "/analytics/location-count-listing",
  GET_ANALYTICS_APPOINTMENT_COUNT: "/analytics/appointment-count",
  GET_ANALYTICS_LISTING_ACTIVE_NONACTIVE_COUNT:
    "/analytics/listing-active-nonactive-count",
  GET_ANALYTICS_TOP_10_USER_WITH_MOST_LISTING:
    "/analytics/top-user-with-most-listing",
  GET_BALANCE_IN_PROCESS: "/analytics/balance-in-process",
  GET_INVOICE_COUNT_STATUS: "/analytics/invoices",
};

export const ReportV1 = {
  CREATE_REPORTS: "/reports",
  GET_REPORTS: "/reports",
  UPDATE_REPORTS: "/reports/",
  DELETE_REPORTS: "/reports/",
  UPDATE_REPORTS_ACCEPT: "/reports/accept/",
  UPDATE_REPORTS_REFUSE: "/reports/refuse/",
};
export const ReviewV1 = {
  CREATE_REVIEWS: "/reviews",
  GET_REVIEWS: "/reviews",
  UPDATE_REVIEWS: "/reviews/",
  DELETE_REVIEWS: "/reviews/",
};

export const UploadV1 = {
  UPLOAD_IMAGE: "/image/upload",
  UPLOAD_MANY_IMAGE: "/image/upload-many",
};

export const searchHistoryV1 = {
  GET_SEARCH_HISTORY: "/search-histories",
  DELETE_SEARCH_HISTORY: "/search-histories/",
  DELETE_ALL_SEARCH_HISTORY: "/search-histories/user",
};

export const appointmentsV1 = {
  CREATE_APPOINTMENT: "/appointments",
  GET_ALL_APPOINTMENT: "/appointments",
  GET_ALL_APPOINTMENT_FOR_HOST: "/appointments/host",
  DELETE_APPOINTMENT: "/appointments/",
  UPDATE_APPOINTMENT: "/appointments/",
};

export const RentedRoomV1 = {
  GET_ALL_RENTED_ROOM_BY_HOST: "/rented-rooms/host",
  GET_ALL_RENTED_ROOM_BY_USER: "/rented-rooms/user",
  UPDATE_RENTED_ROOM: "/rented-rooms/",
  GET_RENTED_ROOM_BY_ID: "/rented-rooms/",
  DELETE_RENTED_ROOM: "/rented-rooms/",
};

export const InvoiceV1 = {
  CREATE_INVOICE: "/invoices",
  UPDATE_INVOICE: "/invoices/",
  DELETE_INVOICE: "/invoices/",
  DELETE_INVOICE_BY_RENTED_ROOM: "/invoices/rented-room/",
  GET_INVOICE: "/invoices/",
  GET_ALL_INVOICE: "/invoices/",
  GET_ALL_INVOICE_BY_HOST: "/invoices/host",
  GET_ALL_INVOICE_BY_USER: "/invoices/user",
};

export const NotificationV1 = {
  CREATE_NOTIFICATION: "/notifications",
  GET_NOTIFICATIONS_BY_USER: "/notifications/user",
  UPDATE_NOTIFICATION: "/notifications/",
  DELETE_NOTIFICATION: "/notifications/",
  GET_NOTIFICATIONS_UNREAD_BY_USER: "/notifications/unread/user",
};

export const BlogV1 = {
  CREATE_BLOG: "/blog-posts",
  GET_BLOG: "/blog-posts",
  GET_DETAIL_BLOG: "/blog-posts/",
};

export const WithdrawalRequestV1 = {
  CREATE_WITHDRAWAL_REQUEST: "/withdrawal-requests",
  GET_WITHDRAWAL_REQUEST: "/withdrawal-requests",
  GET_WITHDRAWAL_REQUEST_BY_USER: "/withdrawal-requests/user",
  UPDATE_WITHDRAWAL_REQUEST: "/withdrawal-requests/",
  DELETE_WITHDRAWAL_REQUEST: "/withdrawal-requests/",
};

export const PaymentInfoV1 = {
  CREATE_PAYMENT_INFO: "/payment-info",
  GET_PAYMENT_INFO: "/payment-info/",
  GET_PAYMENT_INFO_BY_USER: "/payment-info",
  UPDATE_PAYMENT_INFO: "/payment-info/",
  DELETE_PAYMENT_INFO: "/payment-info/",
};

export const TransactionHistoryV1 = {
  CREATE_TRANSACTION_HISTORY: "/transaction-history",
  GET_TRANSACTION_HISTORY_BY_USER: "/transaction-history/user",
};
