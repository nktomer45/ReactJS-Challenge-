
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import AnalyticsChart from '@/components/charts/AnalyticsChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Sample data for demonstration
const generateSampleData = () => {
  const products = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
  const regions = ['Region 1', 'Region 2', 'Region 3', 'Region 4'];
  
  const data = [];
  
  for (const product of products) {
    for (const region of regions) {
      data.push({
        dim1: product,
        dim2: region,
        value1: Math.floor(Math.random() * 100),
        value2: Math.floor(Math.random() * 100)
      });
    }
  }
  
  return data;
};

const ChartView = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate loading data from a database or API
    const loadData = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setData(generateSampleData());
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setData(generateSampleData());
    setIsRefreshing(false);
    toast.success('Chart data refreshed');
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="container py-24 px-4 mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-wrap justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Data Visualization</h1>
                <p className="text-muted-foreground">
                  Visualize your dimensional data with interactive charts.
                </p>
              </div>
              
              <Button
                onClick={handleRefreshData}
                disabled={isLoading || isRefreshing}
                className="flex items-center gap-1 mt-4 sm:mt-0 btn-hover-effect"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>

            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-64"
              >
                <div className="animate-pulse-gentle text-center">
                  <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading chart data...</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <AnalyticsChart data={data} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Chart Insights</CardTitle>
                      <CardDescription>Key observations from the visualization</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Compare performance across different dimensions</li>
                        <li>Identify trends and patterns in your data</li>
                        <li>Detect outliers and anomalies visually</li>
                        <li>Make data-driven decisions based on clear visualizations</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Data Controls</CardTitle>
                      <CardDescription>Options for chart manipulation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Switch between different chart types using the tabs above the chart. Each visualization provides a unique perspective on your data. The chart data is based on the values entered in the Data Entry page.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default ChartView;
