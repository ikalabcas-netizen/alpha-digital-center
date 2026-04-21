/**
 * Geofence cho chấm công tại văn phòng.
 * Cấu hình env (1 hoặc nhiều office, phân cách bằng `;`):
 *   OFFICE_GEOFENCES="lat,lng[,radiusMeters][,name];lat,lng[,radius][,name]"
 *
 * Bán kính mặc định: 150m nếu không truyền.
 *
 * Ví dụ:
 *   OFFICE_GEOFENCES="10.802866,106.644254,ALPHA_HCM"             // dùng radius mặc định
 *   OFFICE_GEOFENCES="10.802866,106.644254,200,ALPHA_HCM"         // radius 200m
 *   OFFICE_GEOFENCES="10.7769,106.7009,150,HCM;10.8231,106.6297,200,XUONG"
 */

export interface OfficeGeofence {
  lat: number;
  lng: number;
  radiusM: number;
  name: string;
}

const DEFAULT_RADIUS_M = 150;

export function loadOfficeGeofences(): OfficeGeofence[] {
  const raw = process.env.OFFICE_GEOFENCES?.trim();
  if (!raw) return [];
  return raw
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry, idx) => {
      const parts = entry.split(',').map((p) => p.trim());
      const lat = parseFloat(parts[0] ?? '');
      const lng = parseFloat(parts[1] ?? '');
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error(`OFFICE_GEOFENCES entry không hợp lệ (lat,lng): ${entry}`);
      }

      // Field 3 có thể là radius (số) hoặc tên (string) → linh hoạt
      const third = parts[2];
      const fourth = parts[3];
      let radiusM = DEFAULT_RADIUS_M;
      let name = `Office#${idx + 1}`;

      if (third !== undefined && third !== '') {
        const asNum = Number(third);
        if (!isNaN(asNum) && asNum > 0) {
          radiusM = Math.round(asNum);
          if (fourth) name = fourth;
        } else {
          // Field 3 là tên, không phải số
          name = third;
          if (fourth) {
            const r = Number(fourth);
            if (!isNaN(r) && r > 0) radiusM = Math.round(r);
          }
        }
      }

      return { lat, lng, radiusM, name };
    });
}

/**
 * Khoảng cách Haversine giữa 2 điểm GPS (mét).
 */
export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000; // bán kính trái đất (m)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export interface GeofenceCheckResult {
  ok: boolean;
  matchedOffice?: OfficeGeofence;
  distanceM?: number; // tới office gần nhất
  message?: string;
}

/**
 * Trả ok=true nếu (lat,lng) nằm trong bất kỳ geofence nào.
 * Nếu không có geofence cấu hình → ok=true (dev mode), kèm message cảnh báo.
 */
export function checkInsideAnyOffice(lat: number, lng: number): GeofenceCheckResult {
  const offices = loadOfficeGeofences();
  if (offices.length === 0) {
    return { ok: true, message: 'OFFICE_GEOFENCES chưa cấu hình — bypass geofence (dev mode)' };
  }

  let closest: { office: OfficeGeofence; distance: number } | null = null;
  for (const office of offices) {
    const distance = haversineMeters(lat, lng, office.lat, office.lng);
    if (distance <= office.radiusM) {
      return { ok: true, matchedOffice: office, distanceM: Math.round(distance) };
    }
    if (!closest || distance < closest.distance) {
      closest = { office, distance };
    }
  }
  return {
    ok: false,
    distanceM: closest ? Math.round(closest.distance) : undefined,
    message: closest
      ? `Bạn đang cách ${closest.office.name} ${Math.round(closest.distance)}m (cần trong ${closest.office.radiusM}m)`
      : 'Không nằm trong geofence văn phòng',
  };
}
