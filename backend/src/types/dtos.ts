export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface Guild {
  id: string;
  name: string;
  icon: string;
  banner: string;
  owner: boolean;
  permissions: string;
  features: string[];
  approximate_member_count: number;
  approximate_presence_count: number;
}
