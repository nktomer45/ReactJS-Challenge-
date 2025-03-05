
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// Sample data for demonstration
const generateSampleWeeks = () => {
  const weeks = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr'];
  
  for (let m = 0; m < months.length; m++) {
    for (let w = 1; w <= 4; w++) {
      const weekNum = m * 4 + w;
      weeks.push({
        week: `W${weekNum}`,
        month: months[m],
        gmDollars: Math.floor(Math.random() * 50000) + 10000,
        salesDollars: Math.floor(Math.random() * 100000) + 50000,
      });
    }
  }
  
  return weeks;
};

// Sample stores
const stores = [
  { id: 1, name: 'Store 1' },
  { id: 2, name: 'Store 2' },
  { id: 3, name: 'Store 3' },
  { id: 4, name: 'Store 4' },
  { id: 5, name: 'Store 5' },
];

const ChartView = () => {
  const [selectedStore, setSelectedStore] = useState<string>('1');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from a database or API
    const loadData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(generateSampleWeeks());
      setIsLoading(false);
    };
    
    loadData();
  }, [selectedStore]);

  // Calculate GM% for each data point
  const chartData = data.map(item => ({
    ...item,
    gmPercent: (item.gmDollars / item.salesDollars) * 100
  }));

  const handleStoreChange = (value: string) => {
    setSelectedStore(value);
    toast.info(`Loading data for ${stores.find(s => s.id.toString() === value)?.name}`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-md shadow-lg">
          <p className="font-medium">{`Week: ${label}`}</p>
          <p style={{ color: '#0088FE' }}>{`GM Dollars: $${payload[0].value.toLocaleString()}`}</p>
          <p style={{ color: '#FF8042' }}>{`GM %: ${payload[1].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Chart View</h1>
            <p className="text-muted-foreground">
              Analyze performance metrics by store over time
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Store:</span>
              <Select value={selectedStore} onValueChange={handleStoreChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-6">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-[500px]"
              >
                <div className="animate-pulse-gentle text-center">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading chart data...</p>
                </div>
              </motion.div>
            ) : (
              <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `$${value/1000}k`}
                      label={{ value: 'GM Dollars', angle: -90, position: 'insideLeft', offset: -5 }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                      label={{ value: 'GM %', angle: 90, position: 'insideRight', offset: 5 }}
                      domain={[0, 50]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine y={40} yAxisId="right" label="Target 40%" stroke="#8884d8" strokeDasharray="3 3" />
                    <ReferenceLine y={10} yAxisId="right" label="Min 10%" stroke="#ff7300" strokeDasharray="3 3" />
                    <Bar 
                      yAxisId="left"
                      dataKey="gmDollars" 
                      name="GM Dollars" 
                      fill="#0088FE" 
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="gmPercent" 
                      name="GM %" 
                      fill="#FF8042" 
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ChartView;
