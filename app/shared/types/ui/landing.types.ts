export type HeaderLink = {
  name: string;
  to: string;
};

export type ForWhomItem = {
  title: string;
  description: string;
  list: string[];
  iconName: string;
};

export type MainFeatureItem = {
  title: string;
  description: string;
  link: string;
  iconName: string;
};

export type ToolItem = {
  title: string;
  description: string;
  featuresTitle: string;
  features: string[];
};

export type TariffPlan = {
  name: string;
  price: number;
  period: string;
  features: {
    text: string;
    /** true/false */
    included: string;
  }[];
};

export type Review = {
  title: string;
  subtitle: string;
  text: string;
  rating: string;
};

export type FaqItem = {
  name: string;
  text: string;
};
