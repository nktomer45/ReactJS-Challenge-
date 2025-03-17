
import { useState, useEffect } from 'react';
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
import { Plus, Trash2, ArrowUpDown, Store } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Store {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  seqNo: number;
}

const initialStoresData: Store[] = [
  { id: 'ST035', name: 'San Francisco Bay Trends', location: 'San Francisco, CA', city: 'San Francisco', state: 'CA', seqNo: 1 },
  { id: 'ST046', name: 'Phoenix Sunwear', location: 'Phoenix, AZ', city: 'Phoenix', state: 'AZ', seqNo: 2 },
  { id: 'ST064', name: 'Dallas Ranch Supply', location: 'Dallas, TX', city: 'Dallas', state: 'TX', seqNo: 3 },
  { id: 'ST066', name: 'Atlanta Outfitters', location: 'Atlanta, GA', city: 'Atlanta', state: 'GA', seqNo: 4 },
  { id: 'ST073', name: 'Nashville Melody Music Store', location: 'Nashville, TN', city: 'Nashville', state: 'TN', seqNo: 5 },
  { id: 'ST074', name: 'New York Empire Eats', location: 'New York, NY', city: 'New York', state: 'NY', seqNo: 6 },
  { id: 'ST091', name: 'Denver Peaks Outdoor', location: 'Denver, CO', city: 'Denver', state: 'CO', seqNo: 7 },
  { id: 'ST094', name: 'Philadelphia Liberty Market', location: 'Philadelphia, PA', city: 'Philadelphia', state: 'PA', seqNo: 8 },
  { id: 'ST097', name: 'Boston Harbor Books', location: 'Boston, MA', city: 'Boston', state: 'MA', seqNo: 9 },
  { id: 'ST101', name: 'Austin Vibe Co.', location: 'Austin, TX', city: 'Austin', state: 'TX', seqNo: 10 },
  { id: 'ST131', name: 'Los Angeles Luxe', location: 'Los Angeles, CA', city: 'Los Angeles', state: 'CA', seqNo: 11 },
  { id: 'ST150', name: 'Houston Harvest Market', location: 'Houston, TX', city: 'Houston', state: 'TX', seqNo: 12 },
  { id: 'ST151', name: 'Portland Evergreen Goods', location: 'Portland, OR', city: 'Portland', state: 'OR', seqNo: 13 },
  { id: 'ST156', name: 'Chicago Charm Boutique', location: 'Chicago, IL', city: 'Chicago', state: 'IL', seqNo: 14 },
  { id: 'ST163', name: 'Las Vegas Neon Treasures', location: 'Las Vegas, NV', city: 'Las Vegas', state: 'NV', seqNo: 15 },
  { id: 'ST175', name: 'Seattle Skyline Goods', location: 'Seattle, WA', city: 'Seattle', state: 'WA', seqNo: 16 },
  { id: 'ST176', name: 'Miami Breeze Apparel', location: 'Miami, FL', city: 'Miami', state: 'FL', seqNo: 17 },
  { id: 'ST177', name: 'San Diego Wave Surf Shop', location: 'San Diego, CA', city: 'San Diego', state: 'CA', seqNo: 18 },
  { id: 'ST193', name: 'Charlotte Queen\'s Closet', location: 'Charlotte, NC', city: 'Charlotte', state: 'NC', seqNo: 19 },
  { id: 'ST208', name: 'Detroit Motor Gear', location: 'Detroit, MI', city: 'Detroit', state: 'MI', seqNo: 20 }
];

const Dimensions1 = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreCity, setNewStoreCity] = useState('');
  const [newStoreState, setNewStoreState] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Load initial stores data
    setStores(initialStoresData);
  }, []);

  const handleAddStore = () => {
    if (!newStoreName.trim()) {
      toast.error('Store name is required');
      return;
    }
    
    if (!newStoreCity.trim() || !newStoreState.trim()) {
      toast.error('City and state are required');
      return;
    }
    
    const nextSeqNo = stores.length > 0 ? Math.max(...stores.map(s => s.seqNo)) + 1 : 1;
    const storeId = `ST${nextSeqNo.toString().padStart(3, '0')}`;
    
    const newStore: Store = {
      id: storeId,
      name: newStoreName,
      location: `${newStoreCity}, ${newStoreState}`,
      city: newStoreCity,
      state: newStoreState,
      seqNo: nextSeqNo
    };
    
    setStores([...stores, newStore]);
    setNewStoreName('');
    setNewStoreCity('');
    setNewStoreState('');
    setIsDialogOpen(false);
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
    
    // Swap sequence numbers
    const tempSeqNo = newStores[index].seqNo;
    newStores[index].seqNo = newStores[targetIndex].seqNo;
    newStores[targetIndex].seqNo = tempSeqNo;
    
    // Swap positions in array
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

        <div className="w-full">
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
                <div className="border rounded-md overflow-hidden overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-12">Order</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Store ID</th>
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
                          <td className="px-4 py-3 font-mono text-sm">{store.id}</td>
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
        
        {/* Floating Add Store Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-8 right-8 rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center z-50"
              size="icon"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>
                Enter the details for the new store below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="dialog-name" className="text-sm font-medium">
                  Store Name
                </label>
                <Input
                  id="dialog-name"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="Enter store name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dialog-city" className="text-sm font-medium">
                  City
                </label>
                <Input
                  id="dialog-city"
                  value={newStoreCity}
                  onChange={(e) => setNewStoreCity(e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="dialog-state" className="text-sm font-medium">
                  State
                </label>
                <Input
                  id="dialog-state"
                  value={newStoreState}
                  onChange={(e) => setNewStoreState(e.target.value)}
                  placeholder="Enter state (e.g. CA)"
                  maxLength={2}
                />
              </div>
              <Button onClick={handleAddStore} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Store
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Dimensions1;
