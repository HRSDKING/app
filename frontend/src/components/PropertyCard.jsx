import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize, Car, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const PropertyCard = ({ property, index = 0 }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = () => {
    switch (property.status) {
      case 'available':
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Available</Badge>;
      case 'sold_out':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Sold Out</Badge>;
      case 'coming_soon':
        return <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      data-testid={`property-card-${property.slug}`}
    >
      <Link to={`/property/${property.slug}`} className="group block">
        <div className="property-card relative overflow-hidden bg-[#121212] border border-white/5">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={property.images[0]}
              alt={property.name}
              className="img-zoom w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {property.is_new_launch && (
                <Badge className="bg-[#D4AF37] text-black border-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  New Launch
                </Badge>
              )}
              {getStatusBadge()}
            </div>

            {/* Price Tag */}
            <div className="absolute bottom-4 left-4">
              <p className="text-white text-sm opacity-70">From</p>
              <p className="font-display text-2xl text-white">
                {formatPrice(property.price_from)}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-display text-xl text-[#EDEDED] mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
              {property.name}
            </h3>
            <p className="flex items-center gap-2 text-[#A1A1AA] text-sm mb-4">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              {property.location}
            </p>

            {/* Features */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#A1A1AA] text-sm">{property.features.bedrooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#A1A1AA] text-sm">{property.features.bathrooms}</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#A1A1AA] text-sm">{property.features.area}m²</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#A1A1AA] text-sm">{property.features.parking}</span>
              </div>
            </div>
          </div>

          {/* Hover Gold Line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      </Link>
    </motion.div>
  );
};
