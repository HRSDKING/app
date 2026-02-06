import { motion } from 'framer-motion';
import {
  Hospital,
  School,
  ShoppingCart,
  Bus,
  Train,
  Waves,
  ShoppingBag,
  Trees,
  Dumbbell,
  Utensils,
} from 'lucide-react';

const iconMap = {
  hospital: Hospital,
  school: School,
  'shopping-cart': ShoppingCart,
  bus: Bus,
  train: Train,
  waves: Waves,
  'shopping-bag': ShoppingBag,
  trees: Trees,
  dumbbell: Dumbbell,
  utensils: Utensils,
};

export const AmenitiesSection = ({ amenities }) => {
  const essentialAmenities = amenities.filter((a) => a.category === 'essential');
  const lifestyleAmenities = amenities.filter((a) => a.category === 'lifestyle');

  const AmenityItem = ({ amenity, index }) => {
    const Icon = iconMap[amenity.icon] || Hospital;
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center justify-between py-4 border-b border-white/5 last:border-0"
        data-testid={`amenity-${amenity.name.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <span className="text-[#EDEDED]">{amenity.name}</span>
        </div>
        <span className="text-[#D4AF37] font-medium">{amenity.distance}</span>
      </motion.div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" data-testid="amenities-section">
      {/* Essential Amenities */}
      <div>
        <h3 className="font-display text-xl text-[#EDEDED] mb-6 flex items-center gap-3">
          <span className="w-12 h-0.5 bg-[#D4AF37]" />
          Essential Services
        </h3>
        <div className="bg-[#121212] border border-white/5 p-6">
          {essentialAmenities.map((amenity, index) => (
            <AmenityItem key={amenity.name} amenity={amenity} index={index} />
          ))}
        </div>
      </div>

      {/* Lifestyle Amenities */}
      <div>
        <h3 className="font-display text-xl text-[#EDEDED] mb-6 flex items-center gap-3">
          <span className="w-12 h-0.5 bg-[#D4AF37]" />
          Lifestyle & Leisure
        </h3>
        <div className="bg-[#121212] border border-white/5 p-6">
          {lifestyleAmenities.map((amenity, index) => (
            <AmenityItem key={amenity.name} amenity={amenity} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
