export interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}
export interface roles {
  id: number;
  name: string;
  created_at: string;
}

export interface ParentAsm {
  id: number;
  name: string;
}

export interface GoemOrg {
  org_id: number;
  org_name: string;
  isactive: boolean;
  org_type_id: number;
  org_type_name: string;
  assigned_status: string;
  parent_asm_name: ParentAsm | null;
  kgd_count: string;
  last_assigned_asm: any;
}
