
import { InjectionToken } from '@angular/core';
import { PermissionMatrix } from '@permissions/domain/aggregates/permission-matrix.aggregate';

export interface PermissionMatrixRepository {
    get(): Promise<PermissionMatrix>;
    save(permissionMatrix: PermissionMatrix): Promise<void>;
}

export const PERMISSION_MATRIX_REPOSITORY = new InjectionToken<PermissionMatrixRepository>('PERMISSION_MATRIX_REPOSITORY');
