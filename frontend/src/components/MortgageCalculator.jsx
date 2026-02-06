import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Building2, Percent, Calendar, Euro, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const MortgageCalculator = ({ defaultPrice = 300000 }) => {
  const [propertyPrice, setPropertyPrice] = useState(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(3.64);
  const [loanTermYears, setLoanTermYears] = useState(25);
  const [result, setResult] = useState(null);
  const [bankRates, setBankRates] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch bank rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await api.getMortgageRates();
        setBankRates(data.rates);
        if (data.rates.length > 0) {
          setSelectedBank(data.rates[0].bank);
          setInterestRate(data.rates[0].rate);
        }
      } catch (error) {
        console.error('Error fetching mortgage rates:', error);
      }
    };
    fetchRates();
  }, []);

  // Calculate mortgage when inputs change
  useEffect(() => {
    const calculateMortgage = async () => {
      setLoading(true);
      try {
        const data = await api.calculateMortgage({
          property_price: propertyPrice,
          down_payment_percent: downPaymentPercent,
          interest_rate: interestRate,
          loan_term_years: loanTermYears,
        });
        setResult(data);
      } catch (error) {
        console.error('Error calculating mortgage:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(calculateMortgage, 300);
    return () => clearTimeout(debounce);
  }, [propertyPrice, downPaymentPercent, interestRate, loanTermYears]);

  // Handle bank selection
  const handleBankChange = (bankName) => {
    setSelectedBank(bankName);
    const bank = bankRates.find(b => b.bank === bankName);
    if (bank) {
      setInterestRate(bank.rate);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-[#121212] border border-white/5 p-6 md:p-8" data-testid="mortgage-calculator">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#D4AF37]/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="font-display text-xl text-white">Mortgage Calculator</h3>
          <p className="text-[#52525B] text-sm">Based on Cyprus bank rates (Dec 2025)</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Property Price */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-[#EDEDED] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              Property Price
            </Label>
            <span className="text-[#D4AF37] font-semibold">{formatCurrency(propertyPrice)}</span>
          </div>
          <Slider
            value={[propertyPrice]}
            onValueChange={(value) => setPropertyPrice(value[0])}
            min={100000}
            max={2000000}
            step={10000}
            className="w-full"
            data-testid="price-slider"
          />
          <div className="flex justify-between text-xs text-[#52525B]">
            <span>€100,000</span>
            <span>€2,000,000</span>
          </div>
        </div>

        {/* Down Payment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-[#EDEDED] flex items-center gap-2">
              <Euro className="w-4 h-4 text-[#D4AF37]" />
              Down Payment
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-[#52525B]" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1a1a1a] border-white/10">
                    <p>Cyprus banks typically require 15-30% down payment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-[#D4AF37] font-semibold">{downPaymentPercent}%</span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={(value) => setDownPaymentPercent(value[0])}
            min={10}
            max={50}
            step={5}
            className="w-full"
            data-testid="downpayment-slider"
          />
          <div className="flex justify-between text-xs text-[#52525B]">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Bank Selection */}
        <div className="space-y-3">
          <Label className="text-[#EDEDED] flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#D4AF37]" />
            Select Bank
          </Label>
          <Select value={selectedBank} onValueChange={handleBankChange}>
            <SelectTrigger className="bg-[#1a1a1a] border-white/10 text-[#EDEDED]" data-testid="bank-select">
              <SelectValue placeholder="Select a bank" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10">
              {bankRates.map((bank) => (
                <SelectItem key={bank.bank} value={bank.bank}>
                  {bank.bank} - {bank.rate}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Interest Rate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-[#EDEDED]">Interest Rate</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                className="w-20 bg-[#1a1a1a] border-white/10 text-[#EDEDED] text-right"
                step={0.05}
                min={1}
                max={10}
                data-testid="interest-input"
              />
              <span className="text-[#A1A1AA]">%</span>
            </div>
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-[#EDEDED] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              Loan Term
            </Label>
            <span className="text-[#D4AF37] font-semibold">{loanTermYears} years</span>
          </div>
          <Slider
            value={[loanTermYears]}
            onValueChange={(value) => setLoanTermYears(value[0])}
            min={5}
            max={30}
            step={5}
            className="w-full"
            data-testid="term-slider"
          />
          <div className="flex justify-between text-xs text-[#52525B]">
            <span>5 years</span>
            <span>30 years</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 pt-8 border-t border-white/10"
          data-testid="mortgage-result"
        >
          <div className="text-center mb-6">
            <p className="text-[#52525B] text-sm uppercase tracking-wider mb-2">Your Monthly Payment</p>
            <p className="font-display text-5xl text-[#D4AF37]">
              {loading ? '...' : formatCurrency(result.monthly_payment)}
            </p>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-center gap-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors py-2"
            data-testid="toggle-details"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-3"
            >
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-[#A1A1AA]">Property Price</span>
                <span className="text-[#EDEDED]">{formatCurrency(propertyPrice)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-[#A1A1AA]">Down Payment ({downPaymentPercent}%)</span>
                <span className="text-[#EDEDED]">{formatCurrency(result.down_payment)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-[#A1A1AA]">Loan Amount</span>
                <span className="text-[#EDEDED]">{formatCurrency(result.loan_amount)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-[#A1A1AA]">Total Interest</span>
                <span className="text-[#EDEDED]">{formatCurrency(result.total_interest)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[#A1A1AA]">Total Payment</span>
                <span className="text-[#D4AF37] font-semibold">{formatCurrency(result.total_payment)}</span>
              </div>
            </motion.div>
          )}

          <p className="text-[#52525B] text-xs text-center mt-6">
            * This is an estimate only. Actual rates may vary based on your credit profile and bank terms.
          </p>
        </motion.div>
      )}
    </div>
  );
};
