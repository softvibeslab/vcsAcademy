import { useState } from 'react';
import { Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const PaymentPlanForm = ({ paymentPlan, onChange, disabled = false }) => {
  const [formData, setFormData] = useState(paymentPlan || {
    payment_plan_months: '',
    monthly_payment: ''
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
          <CreditCard className="w-5 h-5 text-[#D4AF37]" />
          <CardTitle className="text-xl font-bold text-[#F8FAFC] font-['Playfair_Display']">
            Payment Plan
          </CardTitle>
        </div>
        <CardDescription className="text-[#94A3B8]">
          Financing and monthly payment details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Plan Months & Monthly Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3B82F6]" />
              Payment Plan (Months)
            </Label>
            <Input
              type="number"
              value={formData.payment_plan_months}
              onChange={(e) => handleChange('payment_plan_months', e.target.value)}
              placeholder="e.g., 12, 24, 36..."
              disabled={disabled}
              className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono']"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#10B981]" />
              Monthly Payment
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">$</span>
              <Input
                type="number"
                value={formData.monthly_payment}
                onChange={(e) => handleChange('monthly_payment', e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className="bg-black/50 border-white/10 focus:border-[#D4AF37]/50 text-white font-['JetBrains_Mono'] pl-7"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        {(formData.payment_plan_months || formData.monthly_payment) && (
          <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#D4AF37]">Total Contract Value</span>
              <span className="text-lg font-bold text-[#D4AF37] font-['JetBrains_Mono']">
                ${(formData.payment_plan_months * formData.monthly_payment || 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm">
          <p className="text-xs text-[#D4AF37]">
            💡 Enter the financing terms for this purchase. Leave empty if it's a cash sale.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
