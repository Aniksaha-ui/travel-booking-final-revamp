import {
  BarChart3,
  Bus,
  CalendarCheck,
  CircleDollarSign,
  FileText,
  GalleryVerticalEnd,
  Hotel,
  LayoutDashboard,
  Map,
  Package,
  ReceiptText,
  RefreshCcw,
  Route,
  Settings,
  ShieldCheck,
  Ticket,
  UserRound,
  Users,
} from "lucide-react";

const iconMap = {
  BookingManagementIcon: CalendarCheck,
  ComplaintIcon: FileText,
  DashboardIcon: LayoutDashboard,
  GuideManagementIcon: UserRound,
  HotelCheckInIcon: Hotel,
  HotelManagementIcon: Hotel,
  MoneyIcon: CircleDollarSign,
  PackageManagementIcon: Package,
  RefundManagementIcon: RefreshCcw,
  ReportManagementIcon: BarChart3,
  RouteManagementIcon: Route,
  SeatManagementIcon: Ticket,
  SqlMonitorIcon: ShieldCheck,
  TripManagementIcon: Map,
  UserManagementIcon: Users,
  VehicleManagementIcon: Bus,
  TransactionsIcon: ReceiptText,
  SettingsIcon: Settings,
};

export function MenuIcon({ name, size = 18 }) {
  const Icon = iconMap[name] ?? GalleryVerticalEnd;

  return <Icon size={size} />;
}
