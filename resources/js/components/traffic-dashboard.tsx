import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  TooltipProps,
} from 'recharts';
// Import NameType dan ValueType untuk typing Tooltip Recharts
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// 1. Definisi Interface yang Ketat
interface TrafficData {
  time?: string;
  date?: string;
  visitors: number;
}

interface WebsiteTrafficData {
  today: TrafficData[];
  thisMonth: TrafficData[];
  last3Months: TrafficData[];
  thisYear: TrafficData[];
}

// Menggunakan keyof untuk menjamin filter sesuai dengan key di WebsiteTrafficData
type DateFilter = keyof WebsiteTrafficData;

interface Props {
  websiteTrafficData: WebsiteTrafficData;
}

// 2. Komponen Custom Tooltip dengan Type Safety
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 shadow-2xl border border-slate-100 rounded-xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-sm font-medium text-slate-700">
                {entry.name}: <span className="font-bold text-slate-900">{Number(entry.value).toLocaleString()}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function TrafficDashboard({ websiteTrafficData }: Props) {
  // Debug: Log the received data
  React.useEffect(() => {
    console.log('TrafficDashboard - websiteTrafficData:', websiteTrafficData);
  }, [websiteTrafficData]);

  // 3. State dengan explicit type
  const [dateFilter, setDateFilter] = React.useState<DateFilter>('thisMonth');

  const handleDateFilterChange = (value: string) => {
    // Validasi value sebelum set state
    if (value in websiteTrafficData) {
      setDateFilter(value as DateFilter);
    }
  };

  const currentData = websiteTrafficData[dateFilter];
  const dataKey = dateFilter === 'today' ? 'time' : 'date';

  // Check if there's any data to display
  const hasData = currentData && currentData.length > 0 && currentData.some(item => item.visitors > 0);

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center w-full text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum Ada Data Trafik</h3>
      <p className="text-sm text-slate-500 max-w-md">
        Data kunjungan pengunjung untuk periode ini belum tersedia. 
        Kunjungan akan muncul di sini setelah pengunjung mulai mengakses website Anda.
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span>Menunggu data kunjungan...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-slate-800">Analitik Trafik</CardTitle>
            <p className="text-xs text-slate-400 font-medium">Memantau interaksi pengunjung secara real-time</p>
          </div>
          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
            <SelectTrigger className="w-[160px] bg-white border-slate-200 rounded-lg shadow-sm">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100">
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="thisMonth">Bulan Ini</SelectItem>
              <SelectItem value="last3Months">3 Bulan Terakhir</SelectItem>
              <SelectItem value="thisYear">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="min-h-[300px] w-full">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  
                  <XAxis 
                    dataKey={dataKey} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Pengunjung"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBlue)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
