import React, { useState } from 'react';
import { X, ArrowRight, Briefcase, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface WelcomeMessageProps {
  type: 'company' | 'rep';
  onClose: () => void;
}




export function WelcomeMessage({ type, onClose }: WelcomeMessageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = Cookies.get('userId');
  console.log('Stored userId from cookie:', userId);
  const handleContinue = async () => {
    setLoading(true);
    setError(null);
  
    try {
      console.log("Sending request with:", {
        userId,
        newType: type,
      });
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-user-type`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newType: type,
        }),
      });
  
      const data = await response.json();
      console.log("Response from backend:", data);
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user type');
      }
  
      // Save new type in cookie (if backend doesn't do it)
      Cookies.set('userType', type);
  
      // Redirect based on type
      window.location.href = type === 'company' ? '/app4' : '/repcreationprofile';
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error("Error updating user type:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Harx!</h2>
          {type === 'company' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-4">
                We're excited to have you join our platform! Before you can post your first gig, we need to set up your company profile. This will help professionals learn more about your organization and make informed decisions.
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
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-4">
                We're thrilled to have you join our community of contact center professionals! Before you start exploring gigs, let's set up your professional profile to help you stand out to potential employers.
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
          )}
          
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg flex items-center hover:bg-blue-700 transition-colors mx-auto"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}