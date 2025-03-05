
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DimensionMember {
  id: string;
  name: string;
  code: string;
}

interface DimensionFormProps {
  title: string;
  description: string;
  dimensionType: string;
}

const DimensionForm: React.FC<DimensionFormProps> = ({ title, description, dimensionType }) => {
  const [members, setMembers] = useState<DimensionMember[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [tempCode, setTempCode] = useState('');

  const handleAddMember = () => {
    if (!name.trim() || !code.trim()) {
      toast.error('Name and Code are required');
      return;
    }
    
    // Check for duplicates
    if (members.some(member => member.name === name || member.code === code)) {
      toast.error('A member with this name or code already exists');
      return;
    }
    
    const newMember: DimensionMember = {
      id: Date.now().toString(),
      name,
      code
    };
    
    setMembers([...members, newMember]);
    setName('');
    setCode('');
    
    toast.success(`Added ${dimensionType} member: ${name}`);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(member => member.id !== id));
    toast.success('Member removed');
  };

  const startEditing = (member: DimensionMember) => {
    setEditingId(member.id);
    setTempName(member.name);
    setTempCode(member.code);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    if (!tempName.trim() || !tempCode.trim()) {
      toast.error('Name and Code are required');
      return;
    }
    
    setMembers(members.map(member => 
      member.id === id 
        ? { ...member, name: tempName, code: tempCode } 
        : member
    ));
    
    setEditingId(null);
    toast.success('Member updated');
  };

  return (
    <Card className="glass shadow-lg">
      <CardHeader>
        <Badge className="w-fit mb-2">{dimensionType}</Badge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Code
              </label>
              <Input
                id="code"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAddMember} 
            className="w-full btn-hover-effect"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
          
          {members.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border rounded-md overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Code</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <motion.tr 
                      key={member.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="border-t"
                    >
                      {editingId === member.id ? (
                        <>
                          <td className="px-4 py-2">
                            <Input
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              className="h-8"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              value={tempCode}
                              onChange={(e) => setTempCode(e.target.value)}
                              className="h-8"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => saveEdit(member.id)}
                              className="h-8 w-8 text-green-500"
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
                          <td className="px-4 py-2">{member.name}</td>
                          <td className="px-4 py-2">{member.code}</td>
                          <td className="px-4 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(member)}
                              className="h-8 px-2 mr-1 text-muted-foreground hover:text-foreground"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMember(member.id)}
                              className="h-8 w-8 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionForm;
