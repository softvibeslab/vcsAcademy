import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Tag, Award, Percent, Calendar, Scale, Calculator, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const PurchaseInfoForm = ({ purchaseInfo, onChange, disabled = false }) => {
  const [formData, setFormData] = useState(purchaseInfo || {
    purchase_price: '',
    category: '',
    membership_type: '',
    initial_investment: '',
    percentage: '',
    nights: '',
    interest_rate: '',
    adjustment: '',
    balance: ''
  });

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return value.toString();
  };

  return (
    <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#D4AF37]" />
          <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
            Purchase Information
          </CardTitle>
        </div>
        <CardDescription className="text-[#94A3B8]">
          Financial details and membership information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purchase Price & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              Purchase Price
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">$</span>
              <Input
                type="number"
                value={formData.purchase_price}
                onChange={(e) => handleChange('purchase_price', e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono'] pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#94A3B8]">Category</Label>
            <Input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="None"
              disabled={disabled}
              className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white text-sm"
            />
          </div>
        </div>

        {/* Membership Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F59E0B]" />
            Membership Type
          </Label>
          <Input
            type="text"
            value={formData.membership_type}
            onChange={(e) => handleChange('membership_type', e.target.value)}
            placeholder="e.g., Platinum, Gold, Silver..."
            disabled={disabled}
            className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white"
          />
        </div>

        {/* Initial Investment & Percentage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#10B981]" />
              Initial Investment
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">$</span>
              <Input
                type="number"
                value={formData.initial_investment}
                onChange={(e) => handleChange('initial_investment', e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono'] pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#8B5CF6]" />
              Percentage
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.percentage}
                onChange={(e) => handleChange('percentage', e.target.value)}
                placeholder="0.0"
                disabled={disabled}
                className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono'] pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">%</span>
            </div>
          </div>
        </div>

        {/* Nights & Interest Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3B82F6]" />
              Nights
            </Label>
            <Input
              type="number"
              value={formData.nights}
              onChange={(e) => handleChange('nights', e.target.value)}
              placeholder="0"
              disabled={disabled}
              className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono']"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#EC4899]" />
              Interest Rate
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={formData.interest_rate}
                onChange={(e) => handleChange('interest_rate', e.target.value)}
                placeholder="0.0"
                disabled={disabled}
                className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono'] pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">%</span>
            </div>
          </div>
        </div>

        {/* Adjustment & Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#F59E0B]" />
              Adjustment
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">$</span>
              <Input
                type="number"
                value={formData.adjustment}
                onChange={(e) => handleChange('adjustment', e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono'] pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#10B981]" />
              Balance
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">$</span>
              <Input
                type="number"
                value={formData.balance}
                onChange={(e) => handleChange('balance', e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono'] pl-7"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm">
          <p className="text-xs text-[#D4AF37]">
            💡 All financial amounts are in USD. Enter 0 for fields that don't apply.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
