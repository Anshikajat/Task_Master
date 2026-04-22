import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  ArrowRight,
  BarChart2,
  Calendar,
  Users,
  Shield,
  Zap,
  Bell
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Get insights into your productivity with detailed analytics and progress tracking."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Plan your tasks efficiently with our intelligent scheduling system."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team members and share tasks easily."
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Notifications",
      description: "Stay updated with intelligent notifications and reminders."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">TaskMaster</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Tasks Smarter,<br />Not Harder
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            TaskMaster helps you organize your work, boost productivity, and collaborate with your team seamlessly.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg inline-flex items-center">
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/demo" className="text-gray-600 px-8 py-3 rounded-lg hover:bg-white transition border-2 border-gray-200">
              Watch Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-blue-50 p-3 rounded-xl w-fit mb-4">
                <div className="text-blue-600">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose TaskMaster?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the tools you need to stay organized and productive
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Optimized for speed and efficiency</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Secure</h3>
              <p className="text-gray-600">Enterprise-grade security</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Team-Friendly</h3>
              <p className="text-gray-600">Built for collaboration</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of teams who use TaskMaster to stay organized and productive.
          </p>
          <Link to="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition inline-flex items-center">
            Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-gray-800">TaskMaster</span>
              </div>
              <p className="text-gray-600 text-sm">
                Making task management simple and efficient for teams worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-800">Features</a></li>
                <li><a href="#" className="hover:text-gray-800">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-800">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-800">About</a></li>
                <li><a href="#" className="hover:text-gray-800">Blog</a></li>
                <li><a href="#" className="hover:text-gray-800">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-800">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-800">Contact</a></li>
                <li><a href="#" className="hover:text-gray-800">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            <p>© 2024 TaskMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;