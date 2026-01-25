export type FeatureKey =
  | 'JOB_TRACKING'
  | 'ALERTS'
  | 'COURSE_CENTRAL'
  | 'TEMPLATES_PREMIUM'
  | 'RESUME_CREATE'
  | 'ENTERPRISE_INVITES';

export type FeaturePricingScope = 'individual' | 'enterprise';

export interface FeatureDeniedReason {
  feature: FeatureKey;
  message: string;
  pricingScope?: FeaturePricingScope;
}
