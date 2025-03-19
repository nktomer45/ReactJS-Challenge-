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
import { Plus, Trash2, Edit, Check, X, Package } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingActionButton } from '@/components/ui/floating-action-button';

interface SKU {
  id: string;
  name: string;
  code: string;
  price: number;
  cost: number;
  class: string;
  department: string;
}

const initialSkusData: SKU[] = [
  { id: 'SK00158', name: 'Crew Neck Merino Wool Sweater', code: 'SK00158', class: 'Tops', department: "Men's Apparel", price: 114.99, cost: 18.28 },
  { id: 'SK00269', name: 'Faux Leather Leggings', code: 'SK00269', class: 'Jewelry', department: 'Footwear', price: 9.99, cost: 8.45 },
  { id: 'SK00300', name: 'Fleece-Lined Parka', code: 'SK00300', class: 'Jewelry', department: 'Unisex Accessories', price: 199.99, cost: 17.80 },
  { id: 'SK00304', name: 'Cotton Polo Shirt', code: 'SK00304', class: 'Tops', department: "Women's Apparel", price: 139.99, cost: 10.78 },
  { id: 'SK00766', name: 'Foldable Travel Hat', code: 'SK00766', class: 'Tops', department: 'Footwear', price: 44.99, cost: 27.08 },
  { id: 'SK00786', name: 'Chic Quilted Wallet', code: 'SK00786', class: 'Bottoms', department: 'Footwear', price: 14.99, cost: 4.02 },
  { id: 'SK00960', name: 'High-Slit Maxi Dress', code: 'SK00960', class: 'Outerwear', department: 'Sportswear', price: 74.99, cost: 47.47 },
  { id: 'SK01183', name: 'Turtleneck Cable Knit Sweater', code: 'SK01183', class: 'Footwear', department: 'Footwear', price: 49.99, cost: 22.60 },
  { id: 'SK01189', name: 'Retro-Inspired Sunglasses', code: 'SK01189', class: 'Bottoms', department: "Women's Apparel", price: 194.99, cost: 115.63 },
  { id: 'SK01193', name: 'Stretch Denim Overalls', code: 'SK01193', class: 'Bottoms', department: 'Unisex Accessories', price: 129.99, cost: 47.06 },
  { id: 'SK01249', name: 'Adjustable Elastic Headband', code: 'SK01249', class: 'Footwear', department: "Women's Apparel", price: 19.99, cost: 1.34 },
  { id: 'SK01319', name: 'Adjustable Baseball Cap', code: 'SK01319', class: 'Jewelry', department: "Men's Apparel", price: 4.99, cost: 2.29 },
  { id: 'SK01349', name: 'Cotton Polo Shirt', code: 'SK01349', class: 'Bottoms', department: 'Unisex Accessories', price: 114.99, cost: 60.94 },
  { id: 'SK01549', name: 'Faux Suede Ankle Boots', code: 'SK01549', class: 'Tops', department: 'Sportswear', price: 94.99, cost: 71.53 },
  { id: 'SK01566', name: 'Striped Cotton Socks', code: 'SK01566', class: 'Accessories', department: 'Sportswear', price: 9.99, cost: 6.91 },
  { id: 'SK01642', name: 'Performance Compression Tights', code: 'SK01642', class: 'Outerwear', department: 'Sportswear', price: 54.99, cost: 59.61 },
  { id: 'SK01733', name: 'Vintage Logo Hoodie', code: 'SK01733', class: 'Accessories', department: "Men's Apparel", price: 94.99, cost: 84.45 },
  { id: 'SK01896', name: 'Floral Chiffon Wrap Dress', code: 'SK01896', class: 'Accessories', department: 'Unisex Accessories', price: 149.99, cost: 68.55 },
  { id: 'SK01927', name: 'Asymmetrical Hem Skirt', code: 'SK01927', class: 'Jewelry', department: 'Sportswear', price: 99.99, cost: 66.89 },
  { id: 'SK01950', name: 'Slim Fit Pinstripe Suit', code: 'SK01950', class: 'Bottoms', department: "Women's Apparel", price: 99.99, cost: 13.30 }
];

const productClasses = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories', 'Jewelry'];
const departments = ["Men's Apparel", "Women's Apparel", "Unisex Accessories", "Footwear", "Sportswear"];

const Dimensions2 = () => {
  const [skus, setSkus] = useState<SKU[]>([]);
  const [newSkuName, setNewSkuName] = useState('');
  const [newSkuClass, setNewSkuClass] = useState('');
  const [newSkuDepartment, setNewSkuDepartment] = useState('');
  const [newSkuPrice, setNewSkuPrice] = useState('');
  const [newSkuCost, setNewSkuCost] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCost, setEditCost] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setSkus(initialSkusData);
  }, []);

  const handleAddSku = () => {
    if (!newSkuName.trim()) {
      toast.error('SKU name is required');
      return;
    }
    
    if (!newSkuClass) {
      toast.error('Product class is required');
      return;
    }
    
    if (!newSkuDepartment) {
      toast.error('Department is required');
      return;
    }
    
    if (isNaN(parseFloat(newSkuPrice)) || isNaN(parseFloat(newSkuCost))) {
      toast.error('Price and cost must be valid numbers');
      return;
    }
    
    const nextSkuNumber = skus.length > 0 
      ? Math.max(...skus.map(s => parseInt(s.id.substring(2)))) + 1 
      : 1;
    const skuId = `SK${nextSkuNumber.toString().padStart(5, '0')}`;
    
    const newSku: SKU = {
      id: skuId,
      name: newSkuName,
      code: skuId,
      class: newSkuClass,
      department: newSkuDepartment,
      price: parseFloat(newSkuPrice),
      cost: parseFloat(newSkuCost),
    };
    
    setSkus([...skus, newSku]);
    setNewSkuName('');
    setNewSkuClass('');
    setNewSkuDepartment('');
    setNewSkuPrice('');
    setNewSkuCost('');
    setIsDialogOpen(false);
    toast.success(`Added SKU: ${newSkuName}`);
  };

  const handleDeleteSku = (id: string) => {
    setSkus(skus.filter(sku => sku.id !== id));
    toast.success('SKU removed');
  };

  const startEditing = (sku: SKU) => {
    setEditingId(sku.id);
    setEditName(sku.name);
    setEditClass(sku.class);
    setEditDepartment(sku.department);
    setEditPrice(sku.price.toString());
    setEditCost(sku.cost.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) {
      toast.error('SKU name is required');
      return;
    }
    
    if (!editClass) {
      toast.error('Product class is required');
      return;
    }
    
    if (!editDepartment) {
      toast.error('Department is required');
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
            class: editClass,
            department: editDepartment,
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

        <div className="w-full">
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
                <div className="border rounded-md overflow-hidden overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Class</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
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
                              <td className="px-4 py-3 font-mono text-sm">{sku.id}</td>
                              <td className="px-4 py-3">
                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="h-8"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <Select
                                  value={editClass}
                                  onValueChange={setEditClass}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {productClasses.map(cls => (
                                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-4 py-3">
                                <Select
                                  value={editDepartment}
                                  onValueChange={setEditDepartment}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {departments.map(dept => (
                                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
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
                              <td className="px-4 py-3 font-mono text-sm">{sku.id}</td>
                              <td className="px-4 py-3 font-medium max-w-[200px] truncate" title={sku.name}>{sku.name}</td>
                              <td className="px-4 py-3 text-muted-foreground">{sku.class}</td>
                              <td className="px-4 py-3 text-muted-foreground">{sku.department}</td>
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <FloatingActionButton 
              icon={<Plus className="h-6 w-6" />} 
              onClick={() => setIsDialogOpen(true)}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New SKU</DialogTitle>
              <DialogDescription>
                Enter the details for the new SKU below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="dialog-name" className="text-sm font-medium">
                  SKU Name
                </label>
                <Input
                  id="dialog-name"
                  value={newSkuName}
                  onChange={(e) => setNewSkuName(e.target.value)}
                  placeholder="Enter SKU name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dialog-class" className="text-sm font-medium">
                  Product Class
                </label>
                <Select
                  value={newSkuClass}
                  onValueChange={setNewSkuClass}
                >
                  <SelectTrigger id="dialog-class">
                    <SelectValue placeholder="Select product class" />
                  </SelectTrigger>
                  <SelectContent>
                    {productClasses.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dialog-department" className="text-sm font-medium">
                  Department
                </label>
                <Select
                  value={newSkuDepartment}
                  onValueChange={setNewSkuDepartment}
                >
                  <SelectTrigger id="dialog-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dialog-price" className="text-sm font-medium">
                  Price ($)
                </label>
                <Input
                  id="dialog-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newSkuPrice}
                  onChange={(e) => setNewSkuPrice(e.target.value)}
                  placeholder="Enter price"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dialog-cost" className="text-sm font-medium">
                  Cost ($)
                </label>
                <Input
                  id="dialog-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newSkuCost}
                  onChange={(e) => setNewSkuCost(e.target.value)}
                  placeholder="Enter cost"
                />
              </div>
              
              <Button onClick={handleAddSku} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add SKU
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default Dimensions2;
