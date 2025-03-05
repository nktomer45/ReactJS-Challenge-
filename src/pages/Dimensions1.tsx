
import { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

interface Store {
  id: string;
  name: string;
  location: string;
}

const Dimensions1 = () => {
  const [stores, setStores] = useState<Store[]>([
    { id: '1', name: 'Store 1', location: 'New York' },
    { id: '2', name: 'Store 2', location: 'Los Angeles' },
    { id: '3', name: 'Store 3', location: 'Chicago' },
    { id: '4', name: 'Store 4', location: 'Houston' },
    { id: '5', name: 'Store 5', location: 'Phoenix' },
  ]);
  
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreLocation, setNewStoreLocation] = useState('');

  const handleAddStore = () => {
    if (!newStoreName.trim()) {
      toast.error('Store name is required');
      return;
    }
    
    const newStore: Store = {
      id: Date.now().toString(),
      name: newStoreName,
      location: newStoreLocation,
    };
    
    setStores([...stores, newStore]);
    setNewStoreName('');
    setNewStoreLocation('');
    toast.success(`Added store: ${newStoreName}`);
  };

  const handleDeleteStore = (id: string) => {
    setStores(stores.filter(store => store.id !== id));
    toast.success('Store removed');
  };

  const moveStore = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === stores.length - 1)) {
      return;
    }
    
    const newStores = [...stores];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newStores[index], newStores[targetIndex]] = [newStores[targetIndex], newStores[index]];
    setStores(newStores);
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Store Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and organize store locations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Add New Store</CardTitle>
              <CardDescription>Enter store details below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Store Name
                  </label>
                  <Input
                    id="name"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <Input
                    id="location"
                    value={newStoreLocation}
                    onChange={(e) => setNewStoreLocation(e.target.value)}
                    placeholder="Enter location"
                  />
                </div>
                
                <Button 
                  onClick={handleAddStore} 
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Store
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Store List</CardTitle>
              <CardDescription>Manage your stores and their order</CardDescription>
            </CardHeader>
            <CardContent>
              {stores.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No stores added yet. Add your first store.
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-12">Order</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Store Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Location</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store, index) => (
                        <tr key={store.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveStore(index, 'up')}
                                disabled={index === 0}
                                className="h-6 w-6"
                              >
                                <ArrowUpDown className="h-4 w-4 rotate-90" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveStore(index, 'down')}
                                disabled={index === stores.length - 1}
                                className="h-6 w-6"
                              >
                                <ArrowUpDown className="h-4 w-4 rotate-270" />
                              </Button>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{store.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{store.location}</td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteStore(store.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dimensions1;
