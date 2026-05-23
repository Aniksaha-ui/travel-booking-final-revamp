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
    }));

export const normalizeMenuResponse = (payload) => {
  const menuData = payload?.data;

  return {
    mainMenuItems: sortMenuItems(menuData?.MAIN_MENU_ITEMS ?? []),
    bottomMenuItems: sortMenuItems(menuData?.BOTTOM_MENU_ITEMS ?? []),
  };
};

export const normalizeStoredMenuState = (payload) => {
  if (!payload) {
    return { mainMenuItems: [], bottomMenuItems: [] };
  }

  if (Array.isArray(payload)) {
    return { mainMenuItems: sortMenuItems(payload), bottomMenuItems: [] };
  }

  if (payload.mainMenuItems || payload.bottomMenuItems) {
    return {
      mainMenuItems: sortMenuItems(payload.mainMenuItems ?? []),
      bottomMenuItems: sortMenuItems(payload.bottomMenuItems ?? []),
    };
  }

  if (payload.data?.MAIN_MENU_ITEMS || payload.data?.BOTTOM_MENU_ITEMS) {
    return normalizeMenuResponse(payload);
  }

  return { mainMenuItems: [], bottomMenuItems: [] };
};

export const hasChildren = (item) => Array.isArray(item?.children) && item.children.length > 0;

export const getSupportedRoute = (path) => {
  if (path === "/admin/account/daily-balance" || path === "/account/daily-balance") {
    return APP_ROUTES.dailyBalance;
  }

  if (path === "/admin/packages" || path === "/packages") {
    return APP_ROUTES.packages;
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
