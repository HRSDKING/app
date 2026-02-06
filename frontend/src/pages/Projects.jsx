import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '@/lib/api';
import { PropertyCard } from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Projects = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bedroomFilter, setBedroomFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await api.getProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Bedroom filter
    if (bedroomFilter !== 'all') {
      const bedrooms = parseInt(bedroomFilter);
      filtered = filtered.filter((p) => p.features.bedrooms >= bedrooms);
    }

    // Price filter
    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter((p) => {
        if (max) {
          return p.price_from >= min && p.price_from <= max;
        }
        return p.price_from >= min;
      });
    }

    setFilteredProperties(filtered);
  }, [searchTerm, statusFilter, bedroomFilter, priceFilter, properties]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setBedroomFilter('all');
    setPriceFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || bedroomFilter !== 'all' || priceFilter !== 'all';

  return (
    <div className="min-h-screen pt-20" data-testid="projects-page">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=srgb&fm=jpg&q=85')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4"
          >
            Our Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6"
          >
            All Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#A1A1AA] text-lg max-w-2xl"
          >
            Explore our complete collection of residential developments across Limassol.
            From contemporary apartments to luxurious villas, find your perfect home.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-[#121212] border-y border-white/5 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#52525B]" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-[#1a1a1a] border-white/10 text-[#EDEDED] placeholder:text-[#52525B]"
                data-testid="search-input"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 text-[#A1A1AA]"
              data-testid="filter-toggle"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4 w-full md:w-auto`}>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#1a1a1a] border-white/10" data-testid="status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="coming_soon">Coming Soon</SelectItem>
                  <SelectItem value="sold_out">Sold Out</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#1a1a1a] border-white/10" data-testid="bedroom-filter">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="all">All Bedrooms</SelectItem>
                  <SelectItem value="2">2+ Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full md:w-48 bg-[#1a1a1a] border-white/10" data-testid="price-filter">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-250000">Under €250,000</SelectItem>
                  <SelectItem value="250000-400000">€250,000 - €400,000</SelectItem>
                  <SelectItem value="400000-600000">€400,000 - €600,000</SelectItem>
                  <SelectItem value="600000-99999999">€600,000+</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-[#D4AF37] hover:text-[#E5C565] transition-colors"
                  data-testid="clear-filters"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Results Count */}
          <p className="text-[#A1A1AA] mb-8" data-testid="results-count">
            Showing {filteredProperties.length} {filteredProperties.length === 1 ? 'project' : 'projects'}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#121212] aspect-[4/3] animate-pulse" />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#A1A1AA] text-lg mb-4">No projects found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="text-[#D4AF37] hover:text-[#E5C565] transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
