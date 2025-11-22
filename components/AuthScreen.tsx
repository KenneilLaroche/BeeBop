import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { User } from '../types';
import { US_COLLEGES } from '../constants';

interface AuthScreenProps {
  onLogin: (user: Omit<User, 'isAuthenticated'>) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    school: ''
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.toLowerCase().endsWith('.edu')) {
      setError('Strictly for students. You need a .edu email.');
      return;
    }

    if (!formData.username || !formData.password || !formData.school) {
      setError('Please fill in all fields.');
      return;
    }

    // Instead of immediate login, show verification screen
    setIsVerificationSent(true);
  };

  const handleSimulateVerification = () => {
    onLogin({
      email: formData.email,
      school: formData.school,
      username: formData.username,
      password: formData.password,
      profilePicUrl: profilePic || undefined
    });
  };

  // Verification Screen
  if (isVerificationSent) {
    return (
      <div className="min-h-screen bg-bee-300 flex flex-col items-center justify-center p-6 relative overflow-hidden">
         {/* Background elements */}
         <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay opacity-50 blur-xl animate-pulse"></div>
         <div className="absolute bottom-20 right-10 w-64 h-64 bg-bee-500 rounded-full mix-blend-multiply opacity-50 blur-xl"></div>

         <div className="w-full max-w-md bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 text-center">
            <div className="w-20 h-20 bg-bee-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
               <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            
            <h2 className="text-3xl font-black text-black mb-4 uppercase">Check Your Email</h2>
            
            <p className="text-gray-600 font-medium mb-6 leading-relaxed">
              We've sent a verification email to <span className="font-bold text-black block mt-1 text-lg">{formData.email}</span>
            </p>

            <div className="bg-bee-50 p-4 rounded-xl border-2 border-bee-200 mb-8 text-sm font-bold text-bee-900">
               Please check your inbox and <span className="underline">reply</span> to the email to verify your student status.
            </div>

            <div className="space-y-3">
              <Button onClick={handleSimulateVerification} size="lg" className="w-full">
                (Demo) I Have Replied
              </Button>
              
              <button 
                onClick={() => setIsVerificationSent(false)}
                className="text-sm font-bold text-gray-400 hover:text-black underline decoration-2 transition-colors"
              >
                Used wrong email? Go Back
              </button>
            </div>
         </div>
      </div>
    );
  }

  // Sign Up Screen
  return (
    <div className="min-h-screen bg-bee-300 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay opacity-50 blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-bee-500 rounded-full mix-blend-multiply opacity-50 blur-xl"></div>

      <div className="w-full max-w-md bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10">
        <div className="text-center mb-6">
           <h1 className="text-5xl font-black tracking-tighter italic mb-2 text-black">BeeBop.</h1>
           <p className="text-gray-500 font-bold text-sm">Create your anonymous ID</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           {/* Profile Pic Upload */}
           <div className="flex justify-center mb-6">
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-24 h-24 rounded-full border-4 border-black bg-gray-100 cursor-pointer hover:bg-gray-200 relative overflow-hidden group flex items-center justify-center transition-colors"
             >
               {profilePic ? (
                 <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <svg className="w-10 h-10 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               )}
               <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Edit</span>
               </div>
             </div>
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleImageChange}
             />
           </div>

           <div className="grid grid-cols-1 gap-4">
             <div>
               <label className="block text-xs font-bold uppercase mb-1 ml-1 text-gray-800">Username</label>
               <input 
                 type="text" 
                 value={formData.username}
                 onChange={(e) => setFormData({...formData, username: e.target.value})}
                 placeholder="CoolCat99"
                 className="w-full text-black bg-gray-50 border-2 border-black rounded-xl p-3 focus:bg-bee-50 outline-none font-bold"
               />
             </div>
             
             <div>
                <label className="block text-xs font-bold uppercase mb-1 ml-1 text-gray-800">Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full text-black bg-gray-50 border-2 border-black rounded-xl p-3 focus:bg-bee-50 outline-none font-bold"
                />
             </div>

             <div>
               <label className="block text-xs font-bold uppercase mb-1 ml-1 text-gray-800">College Email</label>
               <input 
                 type="email" 
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 placeholder="student@university.edu"
                 className="w-full text-black bg-gray-50 border-2 border-black rounded-xl p-3 focus:bg-bee-50 outline-none font-bold"
               />
             </div>

             <div>
               <label className="block text-xs font-bold uppercase mb-1 ml-1 text-gray-800">School Name</label>
               <input 
                 list="auth-colleges"
                 type="text" 
                 value={formData.school}
                 onChange={(e) => setFormData({...formData, school: e.target.value})}
                 placeholder="Select or type school..."
                 className="w-full text-black bg-gray-50 border-2 border-black rounded-xl p-3 focus:bg-bee-50 outline-none font-bold"
               />
               <datalist id="auth-colleges">
                 {US_COLLEGES.map(school => (
                   <option key={school} value={school} />
                 ))}
               </datalist>
             </div>
           </div>

           {error && (
             <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-xl text-sm font-bold flex items-center gap-2">
               <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
               {error}
             </div>
           )}

           <div className="pt-2">
             <Button type="submit" className="w-full" size="lg">
               Join the Hive
             </Button>
           </div>

           <p className="text-center text-xs text-gray-400 font-medium mt-4">
             By entering, you agree to only post Bops. No flops allowed.
           </p>
        </form>
      </div>
    </div>
  );
};