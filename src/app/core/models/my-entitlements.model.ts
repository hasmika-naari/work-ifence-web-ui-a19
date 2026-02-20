export interface MyEntitlementsDTO {
  subscriberType: string;
  subscriberId: string;
  planCode: string;
  subscriptionStatus: string;
  entitlements: string[];
  limits?: Record<string, any>;
}
