export interface Permissions {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permissions[];
}
