import {
  buildFallbackReportMenuItems,
  REPORT_ROUTE_SET,
  REPORTS_MENU_FALLBACK_ITEM,
} from "../../../constants/reportCatalog";
import { APP_ROUTES } from "../../../constants/routes";

const toOrderNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
};

export const sortMenuItems = (items = []) =>
  [...items]
    .sort((firstItem, secondItem) => toOrderNumber(firstItem.order) - toOrderNumber(secondItem.order))
    .map((item) => ({
      ...item,
      children: sortMenuItems(item.children ?? []),
      reportChildren: sortMenuItems(item.reportChildren ?? []),
    }));

export const hasChildren = (item) => Array.isArray(item?.children) && item.children.length > 0;

const isReportRoute = (route) => REPORT_ROUTE_SET.has(route);

const isReportMenuHubCandidate = (item = {}) => {
  const supportedRoute = getSupportedRoute(item.path);

  if (supportedRoute === APP_ROUTES.reports) {
    return true;
  }

  return (/report/i.test(item.title ?? "") || item.icon === "ReportManagementIcon") && (!supportedRoute || hasChildren(item));
};

const collectNestedReportItems = (items = []) => {
  const reportItems = [];

  items.forEach((item) => {
    const supportedRoute = getSupportedRoute(item.path);

    if (isReportRoute(supportedRoute)) {
      reportItems.push({
        ...item,
        path: supportedRoute,
        children: [],
      });
    }

    reportItems.push(...collectNestedReportItems(item.children ?? []));
    reportItems.push(...collectNestedReportItems(item.reportChildren ?? []));
  });

  return reportItems;
};

const dedupeReportItems = (items = []) => {
  const routes = new Set();

  return sortMenuItems(
    items.reduce((reportItems, item) => {
      const supportedRoute = getSupportedRoute(item.path);

      if (!isReportRoute(supportedRoute) || routes.has(supportedRoute)) {
        return reportItems;
      }

      routes.add(supportedRoute);
      reportItems.push({
        ...item,
        path: supportedRoute,
        children: [],
      });
      return reportItems;
    }, []),
  );
};

const stripReportMenuItems = (items = [], context, location) =>
  items.reduce((nextItems, item) => {
    const supportedRoute = getSupportedRoute(item.path);

    if (isReportMenuHubCandidate(item)) {
      context.reportHubItem = context.reportHubItem ?? item;
      context.reportHubLocation = context.reportHubLocation ?? location;
      context.reportHubOrder = context.reportHubOrder ?? item.order;
      context.reportItems.push(...collectNestedReportItems(item.children ?? []));
      context.reportItems.push(...collectNestedReportItems(item.reportChildren ?? []));
      return nextItems;
    }

    if (isReportRoute(supportedRoute)) {
      context.reportHubLocation = context.reportHubLocation ?? location;
      context.reportHubOrder = context.reportHubOrder ?? item.order;
      context.reportItems.push({
        ...item,
        path: supportedRoute,
        children: [],
      });
      return nextItems;
    }

    nextItems.push({
      ...item,
      children: stripReportMenuItems(item.children ?? [], context, location),
    });

    return nextItems;
  }, []);

const normalizeReportsMenu = ({ mainMenuItems = [], bottomMenuItems = [] }) => {
  const context = {
    reportHubItem: null,
    reportHubLocation: null,
    reportHubOrder: null,
    reportItems: [],
  };

  const nextMainMenuItems = stripReportMenuItems(mainMenuItems, context, "mainMenuItems");
  const nextBottomMenuItems = stripReportMenuItems(bottomMenuItems, context, "bottomMenuItems");
  const reportHubItem = {
    ...REPORTS_MENU_FALLBACK_ITEM,
    ...(context.reportHubItem ?? {}),
    order: context.reportHubOrder ?? context.reportHubItem?.order ?? REPORTS_MENU_FALLBACK_ITEM.order,
    path: APP_ROUTES.reports,
    children: [],
    reportChildren: dedupeReportItems([...context.reportItems, ...buildFallbackReportMenuItems()]),
  };

  if ((context.reportHubLocation ?? "bottomMenuItems") === "mainMenuItems") {
    return {
      mainMenuItems: sortMenuItems([...nextMainMenuItems, reportHubItem]),
      bottomMenuItems: sortMenuItems(nextBottomMenuItems),
    };
  }

  return {
    mainMenuItems: sortMenuItems(nextMainMenuItems),
    bottomMenuItems: sortMenuItems([...nextBottomMenuItems, reportHubItem]),
  };
};

export const normalizeMenuResponse = (payload) => {
  const menuData = payload?.data;

  return normalizeReportsMenu({
    mainMenuItems: sortMenuItems(menuData?.MAIN_MENU_ITEMS ?? []),
    bottomMenuItems: sortMenuItems(menuData?.BOTTOM_MENU_ITEMS ?? []),
  });
};

export const normalizeStoredMenuState = (payload) => {
  if (!payload) {
    return { mainMenuItems: [], bottomMenuItems: [] };
  }

  if (Array.isArray(payload)) {
    return normalizeReportsMenu({ mainMenuItems: sortMenuItems(payload), bottomMenuItems: [] });
  }

  if (payload.mainMenuItems || payload.bottomMenuItems) {
    return normalizeReportsMenu({
      mainMenuItems: sortMenuItems(payload.mainMenuItems ?? []),
      bottomMenuItems: sortMenuItems(payload.bottomMenuItems ?? []),
    });
  }

  if (payload.data?.MAIN_MENU_ITEMS || payload.data?.BOTTOM_MENU_ITEMS) {
    return normalizeMenuResponse(payload);
  }

  return { mainMenuItems: [], bottomMenuItems: [] };
};

export const getSupportedRoute = (path) => {
  if (
    path === "/admin/reports" ||
    path === "/reports" ||
    path === "admin/reports" ||
    path === "reports"
  ) {
    return APP_ROUTES.reports;
  }

  if (
    path === "/admin/visa/applications" ||
    path === "/visa/applications" ||
    path === "admin/visa/applications" ||
    path === "visa/applications" ||
    path === "/admin/visa/applications/:id" ||
    path?.startsWith("/admin/visa/applications/")
  ) {
    return APP_ROUTES.visaApplications;
  }

  if (
    path === "/admin/visa/types" ||
    path === "/visa/types" ||
    path === "admin/visa/types" ||
    path === "visa/types" ||
    path === "/admin/visa/types/add" ||
    path === "/admin/visa/types/update/:id" ||
    path?.startsWith("/admin/visa/types/update/")
  ) {
    return APP_ROUTES.visaTypes;
  }

  if (
    path === "/admin/visa/countries" ||
    path === "/visa/countries" ||
    path === "admin/visa/countries" ||
    path === "visa/countries" ||
    path === "/admin/visa/countries/add" ||
    path === "/admin/visa/countries/update/:id" ||
    path?.startsWith("/admin/visa/countries/update/")
  ) {
    return APP_ROUTES.visaCountries;
  }

  if (path === "/admin/avg-booking-value-report" || path === "/avg-booking-value-report") {
    return APP_ROUTES.avgBookingValueReport;
  }

  if (
    path === "/admin/blog-list" ||
    path === "/blog-list" ||
    path === "admin/blog-list" ||
    path === "blog-list" ||
    path === "/admin/blogs" ||
    path === "/blogs" ||
    path === "/admin/blog/add" ||
    path === "/admin/blog/update/:id" ||
    path?.startsWith("/admin/blog/update/")
  ) {
    return APP_ROUTES.blogs;
  }

  if (
    path === "/admin/menu-items" ||
    path === "/menu-items" ||
    path === "admin/menu-items" ||
    path === "menu-items" ||
    path === "/admin/menu-items/add" ||
    path === "/admin/menu-items/update/:id" ||
    path?.startsWith("/admin/menu-items/update/")
  ) {
    return APP_ROUTES.menuItems;
  }

  if (
    path === "/admin/users" ||
    path === "/users" ||
    path === "admin/users" ||
    path === "users"
  ) {
    return APP_ROUTES.users;
  }

  if (
    path === "/admin/bookings" ||
    path === "/bookings" ||
    path === "admin/bookings" ||
    path === "bookings" ||
    path === "/admin/booking" ||
    path === "/booking"
  ) {
    return APP_ROUTES.bookings;
  }

  if (
    path === "/admin/hotel" ||
    path === "/hotel" ||
    path === "admin/hotel" ||
    path === "hotel" ||
    path === "/admin/hotel/add" ||
    path === "/admin/hotel/update/:id" ||
    path?.startsWith("/admin/hotel/update/")
  ) {
    return APP_ROUTES.hotels;
  }

  if (
    path === "/admin/online-payment-configure" ||
    path === "/online-payment-configure" ||
    path === "admin/online-payment-configure" ||
    path === "online-payment-configure" ||
    path === "/admin/online-payment-configure/add" ||
    path === "/admin/online-payment-configure/update/:id" ||
    path?.startsWith("/admin/online-payment-configure/update/") ||
    path === "/admin/online-configure" ||
    path === "/online-configure" ||
    path === "admin/online-configure" ||
    path === "online-configure"
  ) {
    return APP_ROUTES.onlinePaymentConfig;
  }

  if (
    path === "/admin/bookings/summary" ||
    path === "/bookings/summary" ||
    path === "/admin/booking-summary" ||
    path === "/booking-summary"
  ) {
    return APP_ROUTES.bookingSummary;
  }

  if (path === "/admin/account/daily-balance" || path === "/account/daily-balance") {
    return APP_ROUTES.dailyBalance;
  }

  if (
    path === "/admin/customerValueReport" ||
    path === "/customerValueReport" ||
    path === "admin/customerValueReport" ||
    path === "customerValueReport" ||
    path === "/admin/customerValue"
  ) {
    return APP_ROUTES.customerValueReport;
  }

  if (
    path === "/admin/top-active-customers" ||
    path === "/top-active-customers" ||
    path === "admin/top-active-customers" ||
    path === "top-active-customers"
  ) {
    return APP_ROUTES.topActiveCustomers;
  }

  if (
    path === "/admin/booking-frequency-per-user" ||
    path === "/booking-frequency-per-user" ||
    path === "admin/booking-frequency-per-user" ||
    path === "booking-frequency-per-user"
  ) {
    return APP_ROUTES.bookingFrequencyPerUser;
  }

  if (
    path === "/admin/financialReport" ||
    path === "/financialReport" ||
    path === "admin/financialReport" ||
    path === "financialReport" ||
    path === "/admin/financial_report"
  ) {
    return APP_ROUTES.financialReport;
  }

  if (
    path === "/admin/account/balance" ||
    path === "/account/balance" ||
    path === "admin/account/balance" ||
    path === "account/balance"
  ) {
    return APP_ROUTES.accountBalance;
  }

  if (
    path === "/admin/account/history" ||
    path === "/account/history" ||
    path === "admin/account/history" ||
    path === "account/history"
  ) {
    return APP_ROUTES.accountHistory;
  }

  if (path === "/admin/account/overall-sales" || path === "/account/overall-sales") {
    return APP_ROUTES.overallSales;
  }

  if (path === "/admin/account/route-wise-sales" || path === "/account/route-wise-sales") {
    return APP_ROUTES.routeWiseSales;
  }

  if (path === "/admin/account/ticket-status-report" || path === "/account/ticket-status-report") {
    return APP_ROUTES.ticketStatusReport;
  }

  if (path === "/admin/high-cancellation-packages" || path === "/high-cancellation-packages") {
    return APP_ROUTES.highCancellationPackages;
  }

  if (path === "/admin/refunds" || path === "/admin/refund" || path === "/refunds") {
    return APP_ROUTES.refunds;
  }

  if (
    path === "/admin/transactions" ||
    path === "/transactions" ||
    path === "admin/transactions" ||
    path === "transactions" ||
    path === "/admin/transaction" ||
    path === "/transaction"
  ) {
    return APP_ROUTES.transactions;
  }

  if (path === "/admin/vehicletrackingreport" || path === "/vehicletrackingreport") {
    return APP_ROUTES.vehicleTrackingReport;
  }

  if (path === "/admin/low-occupancy-report" || path === "/low-occupancy-report") {
    return APP_ROUTES.lowOccupancyReport;
  }

  if (path === "/admin/low-performing-packages" || path === "/low-performing-packages") {
    return APP_ROUTES.lowPerformingPackages;
  }

  if (path === "/admin/monitoring" || path === "/monitoring") {
    return APP_ROUTES.monitoring;
  }

  if (path === "/admin/tripPerformance" || path === "/tripPerformance") {
    return APP_ROUTES.tripPerformance;
  }

  if (path === "/admin/vehiclewiseseatreport" || path === "/vehiclewiseseatreport") {
    return APP_ROUTES.vehicleWiseSeatReport;
  }

  if (path === "/admin/packages" || path === "/packages") {
    return APP_ROUTES.packages;
  }

  if (path === "/admin/menu-items" || path === "/menu-items") {
    return APP_ROUTES.menuItems;
  }

  if (path === "/admin/hotel" || path === "/hotel") {
    return APP_ROUTES.hotels;
  }

  if (path === "/admin/tickets" || path === "/tickets") {
    return APP_ROUTES.tickets;
  }

  if (path === "/admin/monthRunningBalance" || path === "/monthRunningBalance") {
    return APP_ROUTES.monthRunningBalance;
  }

  if (path === "/admin/dashboard" || path === "/" || path === "/dashboard") {
    return APP_ROUTES.dashboard;
  }

  if (path === "/admin/routes" || path === "/routes") {
    return APP_ROUTES.routes;
  }

  if (path === "/admin/vehicles" || path === "/admin/vehicle" || path === "/vehicles") {
    return APP_ROUTES.vehicles;
  }

  if (path === "/admin/seats" || path === "/admin/seat" || path === "/seats") {
    return APP_ROUTES.seats;
  }

  if (path === "/admin/trips" || path === "/admin/trip" || path === "/trips") {
    return APP_ROUTES.trips;
  }

  return null;
};
