import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { List } from 'lucide-react';

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

interface CountryData {
  country: string;
  visitors: number;
}

interface RegionData {
  region: string;
  visitors: number;
}

export default function TrafficVisitorCharts({
  websiteTrafficData,
  countryStats,
  regionStats,
}: {
  websiteTrafficData: WebsiteTrafficData;
  countryStats: CountryData[];
  regionStats: RegionData[];
}) {
  const [filter, setFilter] = React.useState<keyof WebsiteTrafficData>('thisMonth');

  const currentData = websiteTrafficData[filter];
  const dataKey = filter === 'today' ? 'time' : 'date';

  const isEmpty = !currentData || currentData.length === 0;
  const isAllZero = currentData?.every((d) => d.visitors === 0);

  return (
    <div className="space-y-6">

      {/* ================= TRAFFIC MAIN ================= */}
      <div className="relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-sm p-6">

        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full" />

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Trafik Kunjungan Situs
            </h2>
            <p className="text-xs text-slate-400">
              Monitoring pengunjung secara realtime
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/cpanel/analytics/visitor-logs">
                <List className="h-4 w-4 mr-2" />
                Lihat Detail
              </Link>
            </Button>
            <select
              className="bg-white border rounded-lg px-3 py-1.5 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="today">Hari Ini</option>
              <option value="thisMonth">Bulan Ini</option>
              <option value="last3Months">3 Bulan</option>
              <option value="thisYear">Tahun</option>
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[320px] relative z-10">
          {!isEmpty && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                <XAxis
                  dataKey={dataKey}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                📊
              </div>
              <p className="text-sm text-slate-500">Belum ada data trafik</p>
            </div>
          )}

          {isAllZero && !isEmpty && (
            <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-slate-400">
              Belum ada aktivitas (0 visitors)
            </div>
          )}
        </div>
      </div>

      {/* ================= COUNTRY & REGION ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* COUNTRY */}
        <div className="rounded-2xl border backdrop-blur-xl p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">
            Per Negara
          </h3>

          <div className="h-[250px]">
            <ResponsiveContainer>
              <BarChart data={countryStats} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="country"
                  type="category"
                  tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Bar dataKey="visitors" radius={[0, 8, 8, 0]}>
                  {countryStats.map((_, i) => (
                    <Cell key={i} fill="#3b82f6" fillOpacity={1 - i * 0.1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REGION */}
        <div className="rounded-2xl border backdrop-blur-xl p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-700 mb-4">
            Per Wilayah
          </h3>

          <div className="h-[250px]">
            <ResponsiveContainer>
              <BarChart data={regionStats} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="region"
                  type="category"
                  tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Bar dataKey="visitors" radius={[0, 8, 8, 0]}>
                  {regionStats.map((_, i) => (
                    <Cell key={i} fill="#10b981" fillOpacity={1 - i * 0.1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}