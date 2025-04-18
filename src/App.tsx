import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Building2, Users, ArrowRight, Headphones, PhoneCall, MessagesSquare, Phone, HeadphonesIcon, Target } from 'lucide-react';
import { WelcomeMessage } from './components/WelcomeMessage';

function App() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeType, setWelcomeType] = useState<'company' | 'rep' | null>(null);

  const handleShowWelcome = (type: 'company' | 'rep') => {
    setWelcomeType(type);
    setShowWelcome(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="h-[40vh] bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">Transform Your Contact Center</h1>
            <p className="text-xl text-gray-100">Connect with opportunities or find the perfect talent for your customer service needs</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Company Card */}
          <div className="group bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
            <div className="h-48 rounded-t-2xl relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" 
                alt="Modern office" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h2 className="text-3xl font-bold text-white">Post a Gig</h2>
                <p className="text-gray-200">For companies seeking customer service talent</p>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="flex items-center text-gray-700">
                  <HeadphonesIcon className="w-6 h-6 mr-4 text-blue-600" />
                  <span>Customer Service Representatives</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <PhoneCall className="w-6 h-6 mr-4 text-blue-600" />
                  <span>Telesales Professionals</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MessagesSquare className="w-6 h-6 mr-4 text-blue-600" />
                  <span>Live Chat Support Agents</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Target className="w-6 h-6 mr-4 text-blue-600" />
                  <span>Technical Support Specialists</span>
                </div>
              </div>
              <button 
                onClick={() => handleShowWelcome('company')}
                className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors"
              >
                Post a Gig
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Professional Card */}
          <div className="group bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
            <div className="h-48 rounded-t-2xl relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80" 
                alt="Customer service professional" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h2 className="text-3xl font-bold text-white">Find Gigs</h2>
                <p className="text-gray-200">For contact center professionals</p>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-6 h-6 mr-4 text-blue-600" />
                  <span>Work with Leading Companies</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="w-6 h-6 mr-4 text-blue-600" />
                  <span>Remote Opportunities Available</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Headphones className="w-6 h-6 mr-4 text-blue-600" />
                  <span>Flexible Scheduling Options</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="w-6 h-6 mr-4 text-blue-600" />
                  <span>Join Professional Communities</span>
                </div>
              </div>
              <button 
                onClick={() => handleShowWelcome('rep')}
                className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors"
              >
                Find Gigs
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg">
            Looking for something specific? Our team is here to help you find the perfect match.
          </p>
        </div>
      </div>

      {showWelcome && welcomeType && (
        <WelcomeMessage
          type={welcomeType}
          onClose={() => setShowWelcome(false)}
        />
      )}
    </div>
  );
}

export default App;