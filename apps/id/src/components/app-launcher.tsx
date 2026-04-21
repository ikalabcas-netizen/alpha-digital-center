import { LayoutGrid, Stethoscope, Building2, UserRound, Cpu, type LucideProps } from "lucide-react";
import { getAppsForRole } from "@/lib/app-registry";

type IconComponent = React.ComponentType<LucideProps>;

const ICON_MAP: Record<string, IconComponent> = {
  LayoutGrid,
  Stethoscope,
  Building2,
  UserRound,
  Cpu,
};

interface AppLauncherProps {
  role: string;
}

export function AppLauncher({ role }: AppLauncherProps) {
  const apps = getAppsForRole(role);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {apps.map((app) => {
        const Icon = ICON_MAP[app.icon];
        return (
          <a
            key={app.id}
            href={app.url}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
          >
            <div className={`h-1.5 rounded-t ${app.color}`} />
            <div className="p-5 flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className={`${app.color} text-white p-2 rounded-lg`}>
                    <Icon size={18} />
                  </div>
                )}
                <span className="font-semibold text-ink">{app.name}</span>
              </div>
              <p className="text-sm text-gray-500 flex-1">{app.description}</p>
              <span className="text-sm font-medium text-[#C9A961] mt-1">Mở →</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
