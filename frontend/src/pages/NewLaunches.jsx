import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { PropertyCard } from '@/components/PropertyCard';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Badge } from '@/components/ui/badge';

const NewLaunches = () => {
  const [newLaunches, setNewLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewLaunches = async () => {
      try {
        const data = await api.getNewLaunches();
        setNewLaunches(data);
      } catch (error) {
        console.error('Error fetching new launches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewLaunches();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Find the featured launch (earliest upcoming)
  const upcomingLaunches = newLaunches
    .filter(p => p.launch_date && new Date(p.launch_date) > new Date())
    .sort((a, b) => new Date(a.launch_date) - new Date(b.launch_date));
  
  const featuredLaunch = upcomingLaunches[0];
  const otherLaunches = newLaunches.filter(p => p.id !== featuredLaunch?.id);

  return (
    <div className="min-h-screen pt-20" data-testid="new-launches-page">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D4AF37] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm"
            >
              Exclusive Opportunities
            </motion.p>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6"
          >
            New Launches
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#A1A1AA] text-lg max-w-2xl"
          >
            Be the first to discover our latest developments. Secure your dream home at 
            launch prices with exclusive early-bird benefits.
          </motion.p>
        </div>
      </section>

      {/* Featured Launch with Countdown */}
      {featuredLaunch && (
        <section className="bg-[#121212] relative" data-testid="featured-launch">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
                <img
                  src={featuredLaunch.images[0]}
                  alt={featuredLaunch.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#121212]/50 lg:to-[#121212]" />
                <Badge className="absolute top-6 left-6 bg-[#D4AF37] text-black border-0 flex items-center gap-1 text-sm px-4 py-2">
                  <Sparkles className="w-4 h-4" />
                  Featured Launch
                </Badge>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                    {featuredLaunch.name}
                  </h2>
                  <p className="flex items-center gap-2 text-[#A1A1AA] mb-6">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    {featuredLaunch.location}
                  </p>
                  <p className="text-[#A1A1AA] leading-relaxed mb-8">
                    {featuredLaunch.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    <p className="text-[#52525B] text-sm uppercase tracking-wider mb-1">Starting From</p>
                    <p className="font-display text-3xl text-[#D4AF37]">
                      {formatPrice(featuredLaunch.price_from)}
                    </p>
                  </div>

                  {/* Countdown */}
                  <div className="mb-8">
                    <CountdownTimer
                      targetDate={featuredLaunch.launch_date}
                      label="Launching In"
                    />
                  </div>

                  {/* Launch Date */}
                  <div className="flex items-center gap-3 mb-8 text-[#A1A1AA]">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    <span>Official Launch: {formatDate(featuredLaunch.launch_date)}</span>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to={`/property/${featuredLaunch.slug}`}
                      className="btn-primary inline-flex items-center gap-2 justify-center"
                      data-testid="featured-launch-cta"
                    >
                      Register Interest
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/contact"
                      className="btn-outline inline-flex items-center gap-2 justify-center"
                    >
                      Schedule Viewing
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]" data-testid="benefits-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl text-white mb-4"
            >
              Early Bird Benefits
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#A1A1AA] max-w-xl mx-auto"
            >
              Register your interest in our new launches and enjoy exclusive advantages.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Priority Selection',
                description: 'Choose from the best units before public launch.',
              },
              {
                title: 'Launch Pricing',
                description: 'Access special introductory prices not available later.',
              },
              {
                title: 'Flexible Payment',
                description: 'Benefit from extended payment plans during pre-launch.',
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#121212] border border-white/5 p-8 text-center"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6">
                  <span className="font-display text-2xl text-[#D4AF37]">{index + 1}</span>
                </div>
                <h3 className="font-display text-xl text-white mb-3">{benefit.title}</h3>
                <p className="text-[#A1A1AA]">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other New Launches */}
      {otherLaunches.length > 0 && (
        <section className="py-16 md:py-24 bg-[#0a0a0a]" data-testid="other-launches">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl text-white mb-12"
            >
              More New Launches
            </motion.h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#121212] aspect-[4/3] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherLaunches.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#121212]" data-testid="new-launches-cta">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl text-white mb-4"
          >
            Don't Miss Out
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] mb-8 max-w-xl mx-auto"
          >
            Register your interest today and be notified about upcoming launches and exclusive events.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2"
              data-testid="register-interest-cta"
            >
              Register Interest
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NewLaunches;
