import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User2, X, ArrowRight, ArrowLeft, Briefcase, Award, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function SetupWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [flowType, setFlowType] = useState<'company' | 'rep' | null>(null);
  const navigate = useNavigate();

  const handleSelection = (type: 'post' | 'find') => {
    if (type === 'post') {
      setFlowType('company');
    } else {
      setFlowType('rep');
    }
    setStep(2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto modal-scrollbar">
      <div className="bg-white rounded-2xl w-full max-w-3xl my-8 p-6 md:p-10 relative max-h-[90vh] overflow-y-auto modal-scrollbar">
        <div className="py-2">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 1 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Contact Center Hub!</h2>
            <p className="text-gray-600 mb-8">
              What would you like to do today?
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="p-6 border-2 border-gray-300 rounded-xl cursor-not-allowed pointer-events-none w-full bg-gray-50">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-500">Post a Gig</h3>
                    <p className="text-gray-400 text-sm">For companies looking to hire contact center reps</p>
                    <div className="mt-2 text-xs text-gray-500 font-medium bg-gray-200 px-2 py-1 rounded">Coming Soon</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/10 rounded-xl pointer-events-none"></div>
              </div>

              <button
                onClick={() => handleSelection('find')}
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                    <User2 className="w-8 h-8 text-blue-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Find a Gig</h3>
                  <p className="text-gray-600 text-sm">For reps seeking contact center opportunities</p>
                </div>
              </button>
            </div>

            <p className="mt-8 text-sm text-gray-500">
              Select your preferred action to continue. You'll be able to customize your experience on the next page.
            </p>
          </div>
        )}

        {step === 2 && flowType === 'company' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Harx!</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-4">
                We're excited to have you join our platform! Before you can post your first gig, we need to set up your company profile. This will help reps learn more about your organization and make informed decisions.
              </p>
              <p className="text-gray-700">
                The next steps will guide you through creating your company profile, including:
              </p>
              <ul className="text-left mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <ArrowRight className="w-4 h-4 mr-2 text-blue-600" />
                  Company information and description
                </li>
                <li className="flex items-center text-gray-700">
                  <ArrowRight className="w-4 h-4 mr-2 text-blue-600" />
                  Contact details
                </li>
                <li className="flex items-center text-gray-700">
                  <ArrowRight className="w-4 h-4 mr-2 text-blue-600" />
                  Company logo and branding
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <button
                onClick={() => navigate('/repcreationwizard')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-3" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && flowType === 'rep' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Harx!</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-4">
                We're thrilled to have you join our community of contact center reps! Before you start exploring gigs, let's set up your rep profile to help you stand out to potential employers.
              </p>
              <p className="text-gray-700">
                Your profile setup will include:
              </p>
              <ul className="text-left mt-4 space-y-2">
                <li className="flex items-center text-gray-700">
                  <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                  Work experience and skills
                </li>
                <li className="flex items-center text-gray-700">
                  <Award className="w-4 h-4 mr-2 text-blue-600" />
                  Certifications and achievements
                </li>
                <li className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Availability and preferences
                </li>
              </ul>
              <p className="mt-4 text-gray-700">
                A complete profile increases your chances of finding the perfect gig that matches your skills and preferences.
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <button
                onClick={() => navigate('/companysearchwizard')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-3" />
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}