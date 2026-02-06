import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const Contact = () => {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property_interest: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await api.getProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropertyChange = (value) => {
    setFormData((prev) => ({ ...prev, property_interest: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.submitContact(formData);
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        property_interest: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20" data-testid="contact-page">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1664993118464-f8e4a58f0b15?crop=entropy&cs=srgb&fm=jpg&q=85')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-white mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#A1A1AA] text-lg max-w-2xl"
          >
            Ready to find your dream home in Cyprus? Our team is here to help you 
            every step of the way.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl text-white mb-8">Visit Our Office</h2>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-4" data-testid="contact-address">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Address</h3>
                      <p className="text-[#A1A1AA]">
                        6 Laiou str., Anna Court, Block A,<br />
                        Flat/Office 502, 7th Floor,<br />
                        3015 Omonoia/Limassol, Cyprus
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4" data-testid="contact-phone">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Phone</h3>
                      <p className="text-[#A1A1AA]">
                        <a href="tel:+35725339143" className="hover:text-[#D4AF37] transition-colors">+357 25 339143</a><br />
                        <a href="tel:+35725388832" className="hover:text-[#D4AF37] transition-colors">+357 25 388832</a><br />
                        <a href="tel:+35799692044" className="hover:text-[#D4AF37] transition-colors">+357 99 692044</a> (Mobile)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4" data-testid="contact-email">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Email</h3>
                      <p className="text-[#A1A1AA]">
                        <a href="mailto:info@evangeloufrantzis.com" className="hover:text-[#D4AF37] transition-colors">
                          info@evangeloufrantzis.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4" data-testid="contact-hours">
                    <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Business Hours</h3>
                      <p className="text-[#A1A1AA]">
                        Monday - Friday: 09:00 - 13:00 & 15:00 - 18:00<br />
                        Saturday - Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="aspect-video bg-[#121212] border border-white/5 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                    <p className="text-[#A1A1AA]">Limassol, Cyprus</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#121212] border border-white/5 p-8 md:p-12">
                <h2 className="font-display text-3xl text-white mb-2">Send Us a Message</h2>
                <p className="text-[#A1A1AA] mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                    data-testid="success-message"
                  >
                    <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                    <h3 className="font-display text-2xl text-white mb-2">Thank You!</h3>
                    <p className="text-[#A1A1AA] mb-6">
                      Your message has been sent successfully. Our team will contact you shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-[#D4AF37] hover:text-[#E5C565] transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[#EDEDED]">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-[#1a1a1a] border-white/10 text-[#EDEDED] placeholder:text-[#52525B] focus:border-[#D4AF37]"
                          placeholder="John Doe"
                          data-testid="input-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#EDEDED]">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="bg-[#1a1a1a] border-white/10 text-[#EDEDED] placeholder:text-[#52525B] focus:border-[#D4AF37]"
                          placeholder="john@example.com"
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[#EDEDED]">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="bg-[#1a1a1a] border-white/10 text-[#EDEDED] placeholder:text-[#52525B] focus:border-[#D4AF37]"
                          placeholder="+357 99 000000"
                          data-testid="input-phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#EDEDED]">Property Interest</Label>
                        <Select value={formData.property_interest} onValueChange={handlePropertyChange}>
                          <SelectTrigger className="bg-[#1a1a1a] border-white/10 text-[#EDEDED]" data-testid="select-property">
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10">
                            <SelectItem value="general">General Inquiry</SelectItem>
                            {properties.map((property) => (
                              <SelectItem key={property.id} value={property.name}>
                                {property.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-[#EDEDED]">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="bg-[#1a1a1a] border-white/10 text-[#EDEDED] placeholder:text-[#52525B] focus:border-[#D4AF37] resize-none"
                        placeholder="Tell us about your requirements..."
                        data-testid="input-message"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="submit-button"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-[#121212]" data-testid="faq-section">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl text-white mb-4"
            >
              Frequently Asked Questions
            </motion.h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'Can I schedule a property viewing?',
                answer: 'Yes! Contact us via phone or fill out the contact form, and our team will arrange a convenient viewing time.',
              },
              {
                question: 'Do you offer financing assistance?',
                answer: 'We partner with major Cyprus banks to offer competitive financing options. Our team can guide you through the process.',
              },
              {
                question: 'What is the buying process for non-residents?',
                answer: 'Non-EU citizens can purchase property in Cyprus with some restrictions. We can connect you with legal experts to assist with the process.',
              },
              {
                question: 'Are properties available for investment purposes?',
                answer: 'Many of our properties are ideal for investment, with strong rental yields in the Limassol area. Contact us for investment-specific advice.',
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] border border-white/5 p-6"
              >
                <h3 className="font-display text-lg text-white mb-2">{faq.question}</h3>
                <p className="text-[#A1A1AA]">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
