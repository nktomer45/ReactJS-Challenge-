
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import DimensionForm from '@/components/dimensions/DimensionForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample dimensions for demonstration
const sampleDimensions = [
  { name: 'Product A', code: 'PROD_A' },
  { name: 'Product B', code: 'PROD_B' },
  { name: 'Product C', code: 'PROD_C' }
];

const Dimensions1 = () => {
  const [activeTab, setActiveTab] = useState('manage');

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="container py-24 px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Dimension Management - Type 1</h1>
              <p className="text-muted-foreground">
                Create, edit, and manage your product dimensions in this section.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="manage">Manage Products</TabsTrigger>
                <TabsTrigger value="import">Bulk Import</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manage" className="mt-0">
                <DimensionForm 
                  title="Product Dimensions" 
                  description="Add and manage product dimensions that will be used in your data analysis." 
                  dimensionType="Product"
                />
              </TabsContent>
              
              <TabsContent value="import" className="mt-0">
                <div className="grid gap-4">
                  <div className="bg-muted/50 p-8 rounded-lg text-center">
                    <h3 className="text-xl font-medium mb-2">Bulk Import Coming Soon</h3>
                    <p className="text-muted-foreground">
                      This feature will allow you to upload CSV files to import multiple dimensions at once.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Dimensions1;
