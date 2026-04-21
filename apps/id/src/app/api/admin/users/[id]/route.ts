import { NextResponse } from "next/server";
import { auth } from "@adc/auth";
import { prisma } from "@adc/database";
import type { UserRole } from "@adc/database";

export const dynamic = "force-dynamic";

const VALID_ROLES = new Set([
  "SUPER_ADMIN",
  "ADMIN",
  "DOCTOR",
  "WAREHOUSE_STAFF",
  "ACCOUNTANT",
  "CUSTOMER",
  "COORDINATOR",
  "TECHNICIAN",
  "DELIVERY",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentRole = session.user.role;
  const isAdmin = currentRole === "SUPER_ADMIN" || currentRole === "ADMIN";
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // Cannot modify yourself
  if (id === session.user.id) {
    return NextResponse.json({ error: "Không thể tự chỉnh sửa tài khoản của mình" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { role, isActive } = body as Record<string, unknown>;

  // Fetch target user to check their current role
  const target = await prisma.user.findUnique({
    where: { id },
    select: { role: true },
  });

  if (!target) {
    return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  }

  // ADMIN cannot modify SUPER_ADMIN users
  if (currentRole === "ADMIN" && target.role === "SUPER_ADMIN") {
    return NextResponse.json({ error: "Không có quyền chỉnh sửa Super Admin" }, { status: 403 });
  }

  const data: { role?: UserRole; isActive?: boolean } = {};

  if (role !== undefined) {
    if (typeof role !== "string" || !VALID_ROLES.has(role)) {
      return NextResponse.json({ error: "Vai trò không hợp lệ" }, { status: 400 });
    }
    // ADMIN cannot set role to SUPER_ADMIN
    if (currentRole === "ADMIN" && role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Không có quyền gán vai trò Super Admin" }, { status: 403 });
    }
    data.role = role as UserRole;
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      return NextResponse.json({ error: "isActive phải là boolean" }, { status: 400 });
    }
    data.isActive = isActive;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Không có dữ liệu để cập nhật" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updated);
}
