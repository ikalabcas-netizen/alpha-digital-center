export interface AppEntry {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  roles: string[];
}

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://alphacenter.vn";
const NOIBO_URL = process.env.NEXT_PUBLIC_NOIBO_URL || "https://noibo.alphacenter.vn";

export const APP_REGISTRY: AppEntry[] = [
  {
    id: "admin-cms",
    name: "Quản trị Marketing",
    description: "CMS website, sản phẩm, blog, tuyển dụng, leads",
    url: `${WEBSITE_URL}/admin`,
    icon: "LayoutGrid",
    color: "bg-[#0B1220]",
    roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  },
  {
    id: "hrm",
    name: "Nội bộ (HRM)",
    description: "Chấm công, xếp lịch, giao việc, KPI nội bộ",
    url: NOIBO_URL,
    icon: "Users",
    color: "bg-[#06B6D4]",
    roles: ["SUPER_ADMIN", "ADMIN", "HR_MANAGER", "EMPLOYEE", "ACCOUNTANT", "SALES"],
  },
  {
    id: "customer",
    name: "Khu vực khách hàng",
    description: "Tra cứu đơn hàng, bảo hành, hồ sơ labo",
    url: `${WEBSITE_URL}/tai-khoan`,
    icon: "Building2",
    color: "bg-[#C9A961]",
    roles: ["CUSTOMER"],
  },
];

export function getAppsForRole(role: string): AppEntry[] {
  if (role === "SUPER_ADMIN") return APP_REGISTRY;
  return APP_REGISTRY.filter((app) => app.roles.includes(role));
}
