export interface ShortUrl {
  code: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  
}

export interface DailyClick {
  _id: string;
  count: number;
}

export interface DeviceBreakdownItem {
  _id: string;
  count: number;
}

export interface Analytics {
  totalClicks: number;
  dailyClicks: DailyClick[];
  deviceBreakdown: DeviceBreakdownItem[];
}
