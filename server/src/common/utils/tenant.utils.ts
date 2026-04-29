import { UserRole } from '../../users/entities/users.entity';

export interface TenantFilter {
  schoolId?: string | null;
  $or?: Array<{ schoolId: string | null }>;
}

export function getTenantFilter(user: any) {
  if (!user) return {};

  if (user.role === UserRole.SUPER_ADMIN) {
    return {};
  }

  // Filter for ADMIN/TEACHER: matching schoolId OR null (global)
  return {
    schoolId: user.schoolId,
    includeGlobal: true,
  };
}

/**
 * Helper to apply tenant isolation logic to in-memory arrays (for current dev phase)
 */
export function applyTenantFilter<T extends { schoolId?: string | null }>(
  data: T[],
  user: any,
): T[] {
  if (!user || user.role === UserRole.SUPER_ADMIN) {
    return data;
  }

  return data.filter(
    (item) => item.schoolId === user.schoolId || item.schoolId === null || item.schoolId === undefined,
  );
}
