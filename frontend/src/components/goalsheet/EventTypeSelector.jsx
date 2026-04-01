import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, X, Clock, MapPin, More, Umbrella, Thermometer, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EVENT_TYPES = [
  { value: 'sale', label: 'Sale', icon: Trophy, color: 'text-[#D4AF37]', bgColor: 'bg-[#D4AF37]/10', borderColor: 'border-[#D4AF37]/30' },
  { value: 'upgrade', label: 'Upgrade', icon: RefreshCw, color: 'text-[#10B981]', bgColor: 'bg-[#10B981]/10', borderColor: 'border-[#10B981]/30' },
  { value: 'no_sale', label: 'No Sale', icon: X, color: 'text-[#EF4444]', bgColor: 'bg-[#EF4444]/10', borderColor: 'border-[#EF4444]/30' },
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-[#F59E0B]', bgColor: 'bg-[#F59E0B]/10', borderColor: 'border-[#F59E0B]/30' },
  { value: 'no_tour', label: 'No Tour', icon: MapPin, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10', borderColor: 'border-[#8B5CF6]/30' },
  { value: 'overflow', label: 'Overflow', icon: More, color: 'text-[#6B7280]', bgColor: 'bg-[#6B7280]/10', borderColor: 'border-[#6B7280]/30' },
  { value: 'day_off', label: 'Day Off', icon: Umbrella, color: 'text-[#3B82F6]', bgColor: 'bg-[#3B82F6]/10', borderColor: 'border-[#3B82F6]/30' },
  { value: 'sick', label: 'Sick', icon: Thermometer, color: 'text-[#EC4899]', bgColor: 'bg-[#EC4899]/10', borderColor: 'border-[#EC4899]/30' },
];

export const EventTypeSelector = ({ selectedEventType, onEventTypeChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedEvent = EVENT_TYPES.find(event => event.value === selectedEventType);

  if (isOpen && !disabled) {
    return (
      <Card className="bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#F8FAFC] font-['Playfair_Display']">
              Select Event Type
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-[#94A3B8] hover:text-white"
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {EVENT_TYPES.map((event, index) => {
              const Icon = event.icon;
              const isSelected = selectedEventType === event.value;

              return (
                <motion.button
                  key={event.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => {
                    onEventTypeChange(event.value);
                    setIsOpen(false);
                  }}
                  className={`p-4 rounded-sm border-2 transition-all ${
                    isSelected
                      ? `${event.bgColor} ${event.borderColor} bg-opacity-20`
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className={`w-8 h-8 ${event.color}`} />
                    <span className={`text-sm font-medium ${isSelected ? event.color : 'text-[#94A3B8]'}`}>
                      {event.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-sm">
            <p className="text-xs text-[#D4AF37]">
              💡 Select the primary event type for today. This will be logged in your activity history.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-gradient-to-br from-white/5 to-transparent border transition-all cursor-pointer ${
        selectedEvent
          ? `${selectedEvent.bgColor} ${selectedEvent.borderColor}`
          : 'border-white/10 hover:border-white/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && setIsOpen(true)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedEvent ? (
              <>
                <selectedEvent.icon className={`w-6 h-6 ${selectedEvent.color}`} />
                <div>
                  <p className="text-xs text-[#94A3B8]">Event Type</p>
                  <p className={`text-sm font-medium ${selectedEvent.color}`}>
                    {selectedEvent.label}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Trophy className="w-6 h-6 text-[#94A3B8]" />
                <div>
                  <p className="text-xs text-[#94A3B8]">Event Type</p>
                  <p className="text-sm font-medium text-[#94A3B8]">Select event...</p>
                </div>
              </>
            )}
          </div>
          {!disabled && (
            <ChevronRight className="w-5 h-5 text-[#94A3B8]" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
