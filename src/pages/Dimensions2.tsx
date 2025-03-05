
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
import { Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface SKU {
  id: string;
  name: string;
  code: string;
  price: number;
  cost: number;
}

const Dimensions2 = () => {
  const [skus, setSkus] = useState<SKU[]>([
    { id: '1', name: 'Product A', code: 'SKU001', price: 19.99, cost: 10.50 },
    { id: '2', name: 'Product B', code: 'SKU002', price: 29.99, cost: 15.75 },
    { id: '3', name: 'Product C', code: 'SKU003', price: 9.99, cost: 4.25 },
    { id: '4', name: 'Product D', code: 'SKU004', price: 49.99, cost: 25.00 },
  ]);
  
  const [newSkuName, setNewSkuName] = useState('');
  const [newSkuCode, setNewSkuCode] = useState('');
  const [newSkuPrice, setNewSkuPrice] = useState('');
  const [newSkuCost, setNewSkuCost] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCost, setEditCost] = useState('');

  const handleAddSku = () => {
    if (!newSkuName.trim() || !newSkuCode.trim()) {
      toast.error('SKU name and code are required');
      return;
    }
    
    if (isNaN(parseFloat(newSkuPrice)) || isNaN(parseFloat(newSkuCost))) {
      toast.error('Price and cost must be valid numbers');
      return;
    }
    
    const newSku: SKU = {
      id: Date.now().toString(),
      name: newSkuName,
      code: newSkuCode,
      price: parseFloat(newSkuPrice),
      cost: parseFloat(newSkuCost),
    };
    
    setSkus([...skus, newSku]);
    setNewSkuName('');
    setNewSkuCode('');
    setNewSkuPrice('');
    setNewSkuCost('');
    toast.success(`Added SKU: ${newSkuName}`);
  };

  const handleDeleteSku = (id: string) => {
    setSkus(skus.filter(sku => sku.id !== id));
    toast.success('SKU removed');
  };

  const startEditing = (sku: SKU) => {
    setEditingId(sku.id);
    setEditName(sku.name);
    setEditCode(sku.code);
    setEditPrice(sku.price.toString());
    setEditCost(sku.cost.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim() || !editCode.trim()) {
      toast.error('SKU name and code are required');
      return;
    }
    
    if (isNaN(parseFloat(editPrice)) || isNaN(parseFloat(editCost))) {
      toast.error('Price and cost must be valid numbers');
      return;
    }
    
    setSkus(skus.map(sku => 
      sku.id === id 
        ? { 
            ...sku, 
            name: editName, 
            code: editCode, 
            price: parseFloat(editPrice), 
            cost: parseFloat(editCost) 
          } 
        : sku
    ));
    
    setEditingId(null);
    toast.success('SKU updated');
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">SKU Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage SKUs with pricing information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Add New SKU</CardTitle>
              <CardDescription>Enter SKU details below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    SKU Name
                  </label>
                  <Input
                    id="name"
                    value={newSkuName}
                    onChange={(e) => setNewSkuName(e.target.value)}
                    placeholder="Enter SKU name"
                  />
                </div>
                
                <div>
                  <label htmlFor="code" className="block text-sm font-medium mb-1">
                    SKU Code
                  </label>
                  <Input
                    id="code"
                    value={newSkuCode}
                    onChange={(e) => setNewSkuCode(e.target.value)}
                    placeholder="Enter SKU code"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    Price ($)
                  </label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newSkuPrice}
                    onChange={(e) => setNewSkuPrice(e.target.value)}
                    placeholder="Enter price"
                  />
                </div>
                
                <div>
                  <label htmlFor="cost" className="block text-sm font-medium mb-1">
                    Cost ($)
                  </label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newSkuCost}
                    onChange={(e) => setNewSkuCost(e.target.value)}
                    placeholder="Enter cost"
                  />
                </div>
                
                <Button 
                  onClick={handleAddSku} 
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add SKU
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>SKU List</CardTitle>
              <CardDescription>Manage your SKUs, prices, and costs</CardDescription>
            </CardHeader>
            <CardContent>
              {skus.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No SKUs added yet. Add your first SKU.
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU Code</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Price ($)</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Cost ($)</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skus.map((sku) => (
                        <tr key={sku.id} className="border-t">
                          {editingId === sku.id ? (
                            <>
                              <td className="px-4 py-3">
                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="h-8"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <Input
                                  value={editCode}
                                  onChange={(e) => setEditCode(e.target.value)}
                                  className="h-8"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="h-8 text-right"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editCost}
                                  onChange={(e) => setEditCost(e.target.value)}
                                  className="h-8 text-right"
                                />
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => saveEdit(sku.id)}
                                  className="h-8 w-8 text-green-500 mr-1"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={cancelEditing}
                                  className="h-8 w-8 text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 font-medium">{sku.name}</td>
                              <td className="px-4 py-3 text-muted-foreground">{sku.code}</td>
                              <td className="px-4 py-3 text-right">${sku.price.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right">${sku.cost.toFixed(2)}</td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditing(sku)}
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground mr-1"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteSku(sku.id)}
                                  className="h-8 w-8 text-destructive hover:text-destructive/90"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </>
                          )}
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

export default Dimensions2;
