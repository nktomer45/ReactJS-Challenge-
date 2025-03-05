
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import DataGrid from '@/components/data/DataGrid';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Sample dimensions for demonstration
const sampleProducts = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
const sampleRegions = ['Region 1', 'Region 2', 'Region 3', 'Region 4'];

const DataEntry = () => {
  const [products, setProducts] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dimensions from a database or API
    const loadDimensions = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(sampleProducts);
      setRegions(sampleRegions);
      setIsLoading(false);
    };
    
    loadDimensions();
  }, []);

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="container py-24 px-4 mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Data Entry & Analysis</h1>
              <p className="text-muted-foreground">
                Enter, edit, and analyze your dimensional data in this interactive grid.
              </p>
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
                  <p className="text-muted-foreground">Loading dimensions...</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Data Grid Instructions</AlertTitle>
                  <AlertDescription>
                    Double-click on Value 1 and Value 2 cells to edit data. Use the "Calculate & Format" button to update the expressions and highlight outliers.
                  </AlertDescription>
                </Alert>
                
                <DataGrid dimensions1={products} dimensions2={regions} />
                
                <Card className="glass shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Conditional Formatting Legend</CardTitle>
                    <CardDescription>The following colors are used to highlight data in the grid</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-sm bg-data-highlight"></span>
                        <span className="text-sm">High calculated values</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-sm bg-data-warning"></span>
                        <span className="text-sm">High outliers (above 1.5 IQR)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-sm bg-data-danger"></span>
                        <span className="text-sm">Low outliers (below 1.5 IQR)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default DataEntry;
