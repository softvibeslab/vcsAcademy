import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, DollarSign, User, Briefcase, TrendingUp,
  Plus, Edit, CheckCircle2, XCircle, Save
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { API } from '@/App';
import axios from 'axios';

export const DailySalesGrid = ({ onRecordUpdate }) => {
  const [salesRecords, setSalesRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    socio: '',
    manager: '',
    volume: 0,
    enganche_pct: 0,
    commission_pct: 0,
    milesingreso: 0,
    daily_tip: ''
  });

  useEffect(() => {
    fetchMonthlyRecords();
  }, []);

  const fetchMonthlyRecords = async () => {
    try {
      const response = await axios.get(`${API}/financial/sales/monthly`, { withCredentials: true });
      if (response.data.success) {
        // Create a map for quick lookup
        const recordsMap = {};
        response.data.data.records.forEach(record => {
          recordsMap[record.day_number] = record;
        });
        setSalesRecords(recordsMap);
      }
    } catch (error) {
      console.error('Error fetching sales records:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDayDialog = (dayNumber) => {
    const existingRecord = salesRecords[dayNumber];

    setFormData(existingRecord ? {
      socio: existingRecord.socio || '',
      manager: existingRecord.manager || '',
      volume: existingRecord.volume || 0,
      enganche_pct: existingRecord.enganche_pct || 0,
      commission_pct: existingRecord.commission_pct || 0,
      milesingreso: existingRecord.milesingreso || 0,
      daily_tip: existingRecord.daily_tip || ''
    } : {
      socio: '',
      manager: '',
      volume: 0,
      enganche_pct: 0,
      commission_pct: 0,
      milesingreso: 0,
      daily_tip: ''
    });

    setSelectedDay(dayNumber);
    setDialogOpen(true);
  };

  const saveDailyRecord = async () => {
    if (selectedDay === null) return;

    setSaving(true);
    try {
      const response = await axios.post(
        `${API}/financial/sales/daily`,
        {
          day_number: selectedDay,
          socio: formData.socio || null,
          manager: formData.manager || null,
          volume: parseFloat(formData.volume) || 0,
          enganche_pct: parseFloat(formData.enganche_pct) || null,
          commission_pct: parseFloat(formData.commission_pct) || 0,
          milesingreso: parseFloat(formData.milesingreso) || 0,
          daily_tip: formData.daily_tip || null
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local state
        setSalesRecords(prev => ({
          ...prev,
          [selectedDay]: response.data.data
        }));

        setDialogOpen(false);
        if (onRecordUpdate) {
          onRecordUpdate();
        }
      }
    } catch (error) {
      console.error('Error saving daily record:', error);
    } finally {
      setSaving(false);
    }
  };

  const getDayStatus = (dayNumber) => {
    const record = salesRecords[dayNumber];
    if (!record) return 'empty';
    if (record.volume > 0) return 'success';
    return 'partial';
  };

  const getDayBadge = (dayNumber) => {
    const status = getDayStatus(dayNumber);
    const record = salesRecords[dayNumber];

    switch (status) {
      case 'success':
        return (
          <Badge className="bg-[#10B981] text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            ${record.volume.toLocaleString()}
          </Badge>
        );
      case 'partial':
        return <Badge className="bg-[#F59E0B] text-white"><Edit className="w-3 h-3 mr-1" />Partial</Badge>;
      default:
        return <Badge className="bg-white/10 text-[#94A3B8]">Empty</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC] font-['Playfair_Display'] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#D4AF37]" />
            Ventas del Mes
          </h3>
          <p className="text-sm text-[#94A3B8] mt-1">
            Track your daily sales performance (25 days)
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-white/10 text-[#F8FAFC] hover:bg-white/20"
        >
          Refresh
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Days with Sales</p>
            <p className="text-2xl font-bold text-[#10B981] font-['JetBrains_Mono']">
              {Object.values(salesRecords).filter(r => r && r.volume > 0).length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#3B82F6]/10 to-transparent border border-[#3B82F6]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Total Volume</p>
            <p className="text-2xl font-bold text-[#3B82F6] font-['JetBrains_Mono']">
              ${Object.values(salesRecords).reduce((sum, r) => sum + (r?.volume || 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30">
          <CardContent className="p-4">
            <p className="text-sm text-[#94A3B8] mb-1">Days Tracked</p>
            <p className="text-2xl font-bold text-[#D4AF37] font-['JetBrains_Mono']">
              {Object.keys(salesRecords).length}/25
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 25-Day Grid */}
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((dayNumber) => {
              const status = getDayStatus(dayNumber);
              const record = salesRecords[dayNumber];

              return (
                <motion.div
                  key={dayNumber}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openDayDialog(dayNumber)}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${status === 'success' ? 'border-[#10B981] bg-[#10B981]/10' : ''}
                    ${status === 'partial' ? 'border-[#F59E0B] bg-[#F59E0B]/10' : ''}
                    ${status === 'empty' ? 'border-white/10 bg-white/5 hover:border-white/20' : ''}
                  `}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-[#F8FAFC] font-['JetBrains_Mono']">
                      {dayNumber}
                    </span>
                    {status === 'success' && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                    {status === 'partial' && <Edit className="w-4 h-4 text-[#F59E0B]" />}
                  </div>

                  {/* Metrics */}
                  {record && (
                    <div className="space-y-1">
                      {record.volume > 0 && (
                        <p className="text-xs font-bold text-[#10B981] font-['JetBrains_Mono']">
                          ${record.volume.toLocaleString()}
                        </p>
                      )}
                      {record.socio && (
                        <p className="text-xs text-[#94A3B8] truncate">
                          {record.socio}
                        </p>
                      )}
                    </div>
                  )}

                  {!record && (
                    <div className="text-center py-2">
                      <Plus className="w-5 h-5 text-[#94A3B8] mx-auto" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#020204] border border-white/20 text-[#F8FAFC] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-['Playfair_Display'] text-[#D4AF37]">
              Day {selectedDay} - Sales Record
            </DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Log your sales performance for day {selectedDay}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Client & Manager */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-[#94A3B8]">Client (Socio)</Label>
                <Input
                  value={formData.socio}
                  onChange={(e) => setFormData(prev => ({ ...prev, socio: e.target.value }))}
                  placeholder="Client name"
                  className="mt-1 bg-black/50 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-[#94A3B8]">Manager</Label>
                <Input
                  value={formData.manager}
                  onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
                  placeholder="Manager name"
                  className="mt-1 bg-black/50 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Sales Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-[#94A3B8]">Volume ($)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]">$</span>
                  <Input
                    type="number"
                    value={formData.volume}
                    onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                    placeholder="0"
                    className="pl-7 bg-black/50 border-white/10 text-white font-['JetBrains_Mono']"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-[#94A3B8]">Enganche (%)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={formData.enganche_pct}
                    onChange={(e) => setFormData(prev => ({ ...prev, enganche_pct: e.target.value }))}
                    placeholder="0"
                    max={100}
                    className="bg-black/50 border-white/10 text-white font-['JetBrains_Mono']"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">%</span>
                </div>
              </div>
              <div>
                <Label className="text-sm text-[#94A3B8]">Commission (%)</Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={formData.commission_pct}
                    onChange={(e) => setFormData(prev => ({ ...prev, commission_pct: e.target.value }))}
                    placeholder="0"
                    max={100}
                    className="bg-black/50 border-white/10 text-white font-['JetBrains_Mono']"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">%</span>
                </div>
              </div>
            </div>

            {/* Milesingreso */}
            <div>
              <Label className="text-sm text-[#94A3B8]">Milesingreso (Ingresos)</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]">$</span>
                <Input
                  type="number"
                  value={formData.milesingreso}
                  onChange={(e) => setFormData(prev => ({ ...prev, milesingreso: e.target.value }))}
                  placeholder="0"
                  className="pl-7 bg-black/50 border-white/10 text-white font-['JetBrains_Mono']"
                />
              </div>
            </div>

            {/* Daily Tip */}
            <div>
              <Label className="text-sm text-[#94A3B8]">¿Qué aprendí hoy? (Notes & Tips)</Label>
              <textarea
                value={formData.daily_tip}
                onChange={(e) => setFormData(prev => ({ ...prev, daily_tip: e.target.value }))}
                placeholder="What did I learn today..."
                rows={3}
                className="mt-1 w-full bg-black/50 border border-white/10 rounded-md p-3 text-white text-sm resize-none focus:border-[#D4AF37]/50 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={saveDailyRecord}
                disabled={saving}
                className="flex-1 bg-[#D4AF37] text-black font-bold uppercase tracking-wider hover:bg-[#B4942D]"
              >
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Record (+10 pts)
                  </>
                )}
              </Button>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="outline"
                className="bg-white/10 text-[#F8FAFC] hover:bg-white/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
