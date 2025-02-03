export interface IOfferDetail {
  id: number;
  url: string;
  title: string;
  last_refresh_time: string;
  created_time: string;
  valid_to_time: string;
  pushup_time: string;
  omnibus_pushup_time: string;
  description: string;
  promotion: IPromotion;
  params: IParam[];
  key_params: any[]; // Не маємо інформації про структуру
  business: boolean;
  user: IUser;
  status: string;
  contact: IContact;
  map: IMap;
  location: ILocation;
  photos: IPhoto[];
  partner: null;
  category: ICategory;
  delivery: IDelivery;
  safedeal: ISafedeal;
  shop: IShop;
  offer_type: string;
}

export interface IPromotion {
  highlighted: boolean;
  urgent: boolean;
  top_ad: boolean;
  options: string[];
  b2c_ad_page: boolean;
  premium_ad_page: boolean;
}

export interface IParam {
  key: string;
  name: string;
  type: string;
  value: IValue;
}

export interface IValue {
  key: string;
  label: string;
}

export interface IUser {
  id: number;
  created: string;
  other_ads_enabled: boolean;
  name: string;
  logo: string | null;
  logo_ad_page: string | null;
  social_network_account_type: string | null;
  photo: string | null;
  banner_mobile: string;
  banner_desktop: string;
  company_name: string;
  about: string;
  b2c_business_page: boolean;
  is_online: boolean;
  last_seen: string;
  seller_type: string | null;
  uuid: string;
}

export interface IContact {
  name: string;
  phone: boolean;
  chat: boolean;
  negotiation: boolean;
  courier: boolean;
}

export interface IMap {
  zoom: number;
  lat: number;
  lon: number;
  radius: number;
  show_detailed: boolean;
}

export interface ILocation {
  city: ICity;
  district: IDistrict;
  region: IRegion;
}

export interface ICity {
  id: number;
  name: string;
  normalized_name: string;
}

export interface IDistrict {
  id: number;
  name: string;
}

export interface IRegion {
  id: number;
  name: string;
  normalized_name: string;
}

export interface IPhoto {
  id: number;
  filename: string;
  rotation: number;
  width: number;
  height: number;
  link: string;
}

export interface ICategory {
  id: number;
  type: string;
}

export interface IDelivery {
  rock: IRock;
}

export interface IRock {
  offer_id: string | null;
  active: boolean;
  mode: string | null;
}

export interface ISafedeal {
  weight: number;
  weight_grams: number;
  status: string;
  safedeal_blocked: boolean;
  allowed_quantity: any[];
}

export interface IShop {
  subdomain: string;
}