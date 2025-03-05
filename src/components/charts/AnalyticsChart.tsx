
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { ChartPie, BarChart2, LineChart as LineChartIcon } from 'lucide-react';

interface AnalyticsChartProps {
  data: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('bar');
  
  useEffect(() => {
    if (data && data.length > 0) {
      // Process data for charts
      const processedData = processDataForCharts(data);
      setChartData(processedData);
    }
  }, [data]);
  
  const processDataForCharts = (rawData: any[]) => {
    // Group data by dimension 1
    const groupedByDim1 = rawData.reduce((acc, item) => {
      const key = item.dim1;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          value1Total: 0,
          value2Total: 0,
          count: 0,
          items: []
        };
      }
      acc[key].value1Total += parseFloat(item.value1) || 0;
      acc[key].value2Total += parseFloat(item.value2) || 0;
      acc[key].count += 1;
      acc[key].items.push(item);
      return acc;
    }, {});
    
    // Convert to array and calculate averages
    return Object.values(groupedByDim1).map((group: any) => ({
      name: group.name,
      value1: group.value1Total,
      value2: group.value2Total,
      value1Avg: group.value1Total / group.count,
      value2Avg: group.value2Total / group.count,
      sum: group.value1Total + group.value2Total,
      items: group.items
    }));
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-md shadow-lg border border-border">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass shadow-lg">
      <CardHeader className="pb-0">
        <CardTitle>Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="bar" className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" /> Bar
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-1">
              <LineChartIcon className="w-4 h-4" /> Line
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-1">
              <ChartPie className="w-4 h-4" /> Pie
            </TabsTrigger>
          </TabsList>
          
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="chart-animate-in h-[400px] w-full"
          >
            <TabsContent value="bar" className="h-full m-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="value1" 
                    name="Value 1" 
                    fill="#0EA5E9" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar 
                    dataKey="value2" 
                    name="Value 2" 
                    fill="#8884D8" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationBegin={300}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="line" className="h-full m-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis tick={{ fill: 'var(--muted-foreground)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value1Avg" 
                    name="Value 1 Avg" 
                    stroke="#0EA5E9" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    animationDuration={1500}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value2Avg" 
                    name="Value 2 Avg" 
                    stroke="#8884D8" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                    animationDuration={1500}
                    animationBegin={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="pie" className="h-full m-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="sum"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1500}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </motion.div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
