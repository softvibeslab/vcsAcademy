import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Shield, Users, MessageSquare, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

export const ContractDetailsForm = ({ contractDetails, onChange, disabled = false }) => {
  const [formData, setFormData] = useState(contractDetails || {
    contract_number: '',
    manager: '',
    legal_officer: '',
    hostess: '',
    notes: '',
    start_follow_up: false,
    is_pending: false,
    cancel_contract: false
  });

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  return (
    <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#D4AF37]" />
          <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
            Contract Details
          </CardTitle>
        </div>
        <CardDescription className="text-[#94A3B8]">
          Sales team and contract information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Number */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            Contract Number
          </Label>
          <Input
            type="text"
            value={formData.contract_number}
            onChange={(e) => handleChange('contract_number', e.target.value)}
            placeholder="Enter contract number..."
            disabled={disabled}
            className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono']"
          />
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <User className="w-4 h-4 text-[#3B82F6]" />
              Manager
            </Label>
            <Input
              type="text"
              value={formData.manager}
              onChange={(e) => handleChange('manager', e.target.value)}
              placeholder="Manager name..."
              disabled={disabled}
              className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#10B981]" />
              Legal Officer
            </Label>
            <Input
              type="text"
              value={formData.legal_officer}
              onChange={(e) => handleChange('legal_officer', e.target.value)}
              placeholder="Verification officer..."
              disabled={disabled}
              className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#8B5CF6]" />
            Hostess
          </Label>
          <Input
            type="text"
            value={formData.hostess}
            onChange={(e) => handleChange('hostess', e.target.value)}
            placeholder="Tour hostess..."
            disabled={disabled}
            className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#F59E0B]" />
            Notes
          </Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional notes about this sale..."
            disabled={disabled}
            className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white min-h-[80px] resize-none"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <Label className="text-sm text-[#F8FAFC] cursor-pointer">
                Start follow-up file
              </Label>
            </div>
            <Checkbox
              checked={formData.start_follow_up}
              onCheckedChange={(checked) => handleChange('start_follow_up', checked)}
              disabled={disabled}
              className="border-white/20"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
              <Label className="text-sm text-[#F8FAFC] cursor-pointer">
                Sale is pending
              </Label>
            </div>
            <Checkbox
              checked={formData.is_pending}
              onCheckedChange={(checked) => handleChange('is_pending', checked)}
              disabled={disabled}
              className="border-white/20"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle className="w-4 h-4 text-[#EF4444]" />
              <Label className="text-sm text-[#EF4444] cursor-pointer">
                Cancel contract
              </Label>
            </div>
            <Checkbox
              checked={formData.cancel_contract}
              onCheckedChange={(checked) => handleChange('cancel_contract', checked)}
              disabled={disabled}
              className="border-white/20 text-[#EF4444]"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm">
          <p className="text-xs text-[#D4AF37]">
            💡 Complete contract details for accurate tracking and follow-up automation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
