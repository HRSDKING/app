import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Users, Award, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { PropertyCard } from '@/components/PropertyCard';
import { CountdownTimer } from '@/components/CountdownTimer';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [newLaunches, setNewLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, launches] = await Promise.all([
          api.getFeaturedProperties(),
          api.getNewLaunches(),
        ]);
        setFeaturedProperties(featured);
        setNewLaunches(launches);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: Building2, value: '150+', label: 'Projects Completed' },
    { icon: Users, value: '2,000+', label: 'Happy Families' },
    { icon: Award, value: '54', label: 'Years Experience' },
    { icon: Clock, value: '2,500+', label: 'Units Delivered' },
  ];

  const upcomingLaunch = newLaunches.find(p => p.launch_date && new Date(p.launch_date) > new Date());

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden" data-testid="hero-section">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1664993118464-f8e4a58f0b15?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="Luxury Cyprus Real Estate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-6"
            >
              Since 1971
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight"
            >
              Building<br />
              <span className="text-gold-gradient">Dreams</span> in<br />
              Cyprus
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#A1A1AA] text-lg md:text-xl mb-10 max-w-xl leading-relaxed"
            >
              Over 50 years of excellence in crafting exceptional homes. 
              Discover luxury living in Limassol's most prestigious locations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/projects"
                className="btn-primary inline-flex items-center gap-2 justify-center"
                data-testid="hero-cta-projects"
              >
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/new-launches"
                className="btn-outline inline-flex items-center gap-2 justify-center"
                data-testid="hero-cta-launches"
              >
                <Sparkles className="w-4 h-4" />
                New Launches
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-[#D4AF37] rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* New Launch Banner */}
      {upcomingLaunch && (
        <section className="bg-[#121212] border-y border-[#D4AF37]/20" data-testid="new-launch-banner">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#D4AF37] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
                <div>
                  <p className="text-[#D4AF37] uppercase tracking-widest text-sm mb-1">Upcoming Launch</p>
                  <h3 className="font-display text-2xl md:text-3xl text-white">{upcomingLaunch.name}</h3>
                  <p className="text-[#A1A1AA]">{upcomingLaunch.location}</p>
                </div>
              </div>
              <CountdownTimer targetDate={upcomingLaunch.launch_date} label="Launching In" />
              <Link
                to={`/property/${upcomingLaunch.slug}`}
                className="btn-outline flex items-center gap-2"
                data-testid="banner-cta"
              >
                Learn More
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
                <p className="font-display text-4xl md:text-5xl text-white mb-2">{stat.value}</p>
                <p className="text-[#A1A1AA] text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]" data-testid="featured-properties">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4"
              >
                Featured Properties
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-5xl text-white"
              >
                Exceptional Living Spaces
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#E5C565] transition-colors mt-6 md:mt-0"
                data-testid="view-all-properties"
              >
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#121212] aspect-[4/3] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 md:py-32 bg-[#121212] relative overflow-hidden" data-testid="about-teaser">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#121212]" />
          <img
            src="https://images.unsplash.com/photo-1631171992385-784ae02b1acb?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="Construction"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4"
            >
              Our Legacy
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl text-white mb-6"
            >
              Over 50 Years of Excellence
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#A1A1AA] text-lg leading-relaxed mb-8"
            >
              Since 1971, Evangelou & Frantzis has been at the forefront of Cyprus real estate, 
              delivering exceptional quality and design. Our family-run business has grown into 
              one of Limassol's most trusted developers, with over 2,500 units delivered to 
              satisfied homeowners.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/about"
                className="btn-outline inline-flex items-center gap-2"
                data-testid="about-cta"
              >
                Our Story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative" data-testid="cta-section">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1664993118464-f8e4a58f0b15?crop=entropy&cs=srgb&fm=jpg&q=85')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6"
          >
            Ready to Find Your<br />
            <span className="text-gold-gradient">Dream Home?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] text-lg mb-10 max-w-xl mx-auto"
          >
            Contact our team today to schedule a viewing or discuss your requirements.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2 justify-center"
              data-testid="cta-contact"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+35725339143"
              className="btn-outline inline-flex items-center gap-2 justify-center"
              data-testid="cta-call"
            >
              Call +357 25 339143
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
