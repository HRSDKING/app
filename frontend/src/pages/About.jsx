import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Award, Clock, Target, Shield, Lightbulb, Heart } from 'lucide-react';
import { api } from '@/lib/api';

const About = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const data = await api.getCompanyInfo();
        setCompanyInfo(data);
      } catch (error) {
        console.error('Error fetching company info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyInfo();
  }, []);

  const iconMap = {
    Quality: Target,
    Integrity: Shield,
    Innovation: Lightbulb,
    'Customer Focus': Heart,
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" data-testid="about-page">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1631171992385-784ae02b1acb?crop=entropy&cs=srgb&fm=jpg&q=85"
            alt="Construction"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4"
            >
              Our Story
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6"
            >
              Building Dreams<br />
              <span className="text-gold-gradient">Since 1971</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#A1A1AA] text-lg leading-relaxed"
            >
              {companyInfo?.description || 'A family-run business that has grown into a major player in Cyprus real estate.'}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#121212] border-y border-white/5" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Building2, value: companyInfo?.stats?.projects_completed || '150+', label: 'Projects Completed' },
              { icon: Users, value: companyInfo?.stats?.happy_families?.toLocaleString() || '2,000+', label: 'Happy Families' },
              { icon: Award, value: companyInfo?.stats?.years_experience || '54', label: 'Years Experience' },
              { icon: Clock, value: companyInfo?.stats?.units_delivered?.toLocaleString() || '2,500+', label: 'Units Delivered' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
                <p className="font-display text-4xl text-white mb-2">{stat.value}</p>
                <p className="text-[#A1A1AA] text-sm uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]" data-testid="history-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4">Our Legacy</p>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                A Tradition of Excellence
              </h2>
              <div className="space-y-6 text-[#A1A1AA] leading-relaxed">
                <p>
                  Founded in 1971, Evangelou & Frantzis Developers has grown from a small family 
                  business into one of Limassol's most respected construction and development companies.
                </p>
                <p>
                  Over five decades, we have remained true to our founding principles: unwavering 
                  commitment to quality, honest dealings with our clients, and a passion for creating 
                  homes that families cherish for generations.
                </p>
                <p>
                  Today, our portfolio includes over 150 completed projects and more than 2,500 
                  residential units delivered to satisfied homeowners across Limassol and beyond.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] relative">
                <img
                  src="https://images.unsplash.com/photo-1644657711115-ee46e8dd7c7d?crop=entropy&cs=srgb&fm=jpg&q=85"
                  alt="Our Legacy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-8 -left-8 bg-[#D4AF37] p-8">
                  <p className="font-display text-5xl text-black">54</p>
                  <p className="text-black/70 uppercase tracking-wider text-sm">Years of Trust</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32 bg-[#121212]" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4"
            >
              What We Stand For
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl text-white"
            >
              Our Core Values
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyInfo?.values?.map((value, index) => {
              const Icon = iconMap[value.title] || Target;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1a1a1a] border border-white/5 p-8 hover:border-[#D4AF37]/30 transition-colors"
                  data-testid={`value-${value.title.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="w-14 h-14 bg-[#D4AF37]/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-display text-xl text-white mb-3">{value.title}</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]" data-testid="timeline-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4"
            >
              Our Journey
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl text-white"
            >
              Milestones
            </motion.h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#D4AF37]/20" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {[
                { year: '1971', title: 'Founded', description: 'Evangelou & Frantzis established as a family construction business.' },
                { year: '1985', title: 'First Major Project', description: 'Completed our first large-scale residential development.' },
                { year: '2000', title: 'Expansion', description: 'Expanded operations across multiple districts in Limassol.' },
                { year: '2015', title: '1000th Unit', description: 'Delivered our 1000th residential unit to happy homeowners.' },
                { year: '2024', title: 'Modern Era', description: 'Launching premium developments with smart home technology.' },
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="md:w-1/2 md:text-right pl-12 md:pl-0">
                    {index % 2 === 0 && (
                      <>
                        <span className="font-display text-3xl text-[#D4AF37]">{item.year}</span>
                        <h3 className="font-display text-xl text-white mt-2 mb-2">{item.title}</h3>
                        <p className="text-[#A1A1AA]">{item.description}</p>
                      </>
                    )}
                  </div>
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-[#D4AF37] rounded-full transform -translate-x-1/2 mt-2" />
                  <div className="md:w-1/2 pl-12 md:pl-8">
                    {index % 2 !== 0 && (
                      <>
                        <span className="font-display text-3xl text-[#D4AF37]">{item.year}</span>
                        <h3 className="font-display text-xl text-white mt-2 mb-2">{item.title}</h3>
                        <p className="text-[#A1A1AA]">{item.description}</p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team / CTA */}
      <section className="py-24 md:py-32 bg-[#121212] relative overflow-hidden" data-testid="cta-section">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1649503411891-26ff44a3d6cf?crop=entropy&cs=srgb&fm=jpg&q=85')] bg-cover bg-center opacity-5" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl text-white mb-6"
          >
            Ready to Work With Us?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#A1A1AA] text-lg mb-8 max-w-xl mx-auto"
          >
            Join thousands of satisfied homeowners who trusted us with their dreams.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a
              href="/contact"
              className="btn-primary inline-block"
              data-testid="about-cta"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
