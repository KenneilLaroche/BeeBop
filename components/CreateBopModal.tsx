import React, { useState, useRef, useEffect } from 'react';
import { CollegeYear, CreateBopFormData } from '../types';
import { Button } from './Button';
import { generateVibeCheck, analyzeImageVibe } from '../services/geminiService';
import { US_COLLEGES } from '../constants';

interface CreateBopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBopFormData, imageFile: File) => void;
  userSchool?: string;
}

export const CreateBopModal: React.FC<CreateBopModalProps> = ({ isOpen, onClose, onSubmit, userSchool }) => {
  const [formData, setFormData] = useState<CreateBopFormData>({
    name: '',
    school: '',
    year: CollegeYear.FRESHMAN,
    rating: 5.0,
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill school when modal opens
  useEffect(() => {
    if (isOpen && userSchool) {
      setFormData(prev => ({ ...prev, school: userSchool }));
    }
  }, [isOpen, userSchool]);

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Optional: Auto-rate based on image
      setIsAnalyzing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if(typeof reader.result === 'string') {
             const suggestedRating = await analyzeImageVibe(reader.result);
             setFormData(prev => ({ ...prev, rating: suggestedRating }));
             setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoGenerate = async () => {
    if (!formData.name || !formData.school) {
      alert("Please enter Name and School first!");
      return;
    }
    setIsGenerating(true);
    const vibe = await generateVibeCheck(formData.name, formData.school, formData.year);
    setFormData(prev => ({ ...prev, description: vibe }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please upload a photo!");
      return;
    }
    onSubmit(formData, imageFile);
    onClose();
  };

  const getRatingLabel = (r: number) => {
    if (r < 2) return 'SAINT 😇';
    if (r < 4) return 'ANGEL 👼';
    if (r < 7) return 'MEH! 😐';
    if (r < 8) return 'DEMI-BOP ⚡';
    return 'BOP! 🔥';
  };

  const getRatingColor = (r: number) => {
     if (r < 2) return 'text-blue-500';
     if (r < 4) return 'text-cyan-500';
     if (r < 7) return 'text-gray-500';
     if (r < 8) return 'text-orange-500';
     return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg border-4 border-black rounded-3xl p-6 shadow-2xl relative my-8 text-black">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-3xl font-black mb-6 text-center uppercase text-black">New Bop Alert</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Image Upload */}
          <div className="flex justify-center">
            <div 
              className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-400 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-bee-50 transition-colors overflow-hidden relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2 text-gray-400 text-xs font-bold">
                  Click to<br/>Upload<br/>Photo
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
              {isAnalyzing && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold animate-pulse">Analyzing...</span>
                 </div>
              )}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold uppercase mb-1 ml-1 text-gray-800">Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full text-black bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus:border-black focus:ring-0 outline-none font-bold"
                  placeholder="e.g. Brad"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase mb-1 ml-1 text-gray-800">School</label>
                <input 
                  list="create-colleges"
                  type="text" 
                  required
                  className="w-full text-black bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus:border-black focus:ring-0 outline-none font-bold"
                  placeholder="e.g. Harvard"
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                />
                <datalist id="create-colleges">
                   {US_COLLEGES.map(school => (
                     <option key={school} value={school} />
                   ))}
                </datalist>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1 ml-1 text-gray-800">Year</label>
            <select 
              className="w-full text-black bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus:border-black focus:ring-0 outline-none font-bold"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value as CollegeYear})}
            >
              {Object.values(CollegeYear).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Rating Slider */}
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
             <label className="flex justify-between items-center text-xs font-bold uppercase mb-2 text-gray-800">
                <span>Bop Rating</span>
                <div className="text-right">
                   <span className={`text-2xl block ${getRatingColor(formData.rating)}`}>
                      {formData.rating.toFixed(1)}
                   </span>
                   <span className="text-[10px] text-gray-400">{getRatingLabel(formData.rating)}</span>
                </div>
             </label>
             <input 
               type="range" 
               min="1" 
               max="10" 
               step="0.1"
               value={formData.rating}
               onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
               className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-2"
             />
             <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
               <span>😇 Saint (1.0)</span>
               <span>🔥 Bop (10.0)</span>
             </div>
          </div>

          {/* Description with AI Generation */}
          <div>
             <div className="flex justify-between items-end mb-1">
                <label className="block text-xs font-bold uppercase ml-1 text-gray-800">Vibe Check</label>
                <button 
                  type="button"
                  onClick={handleAutoGenerate}
                  className="text-xs text-bee-600 font-bold hover:underline flex items-center gap-1"
                  disabled={isGenerating}
                >
                   {isGenerating ? 'Thinking...' : '✨ AI Auto-Write'}
                </button>
             </div>
             <textarea 
                required
                maxLength={150}
                rows={3}
                className="w-full text-black bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus:border-black focus:ring-0 outline-none font-medium resize-none"
                placeholder="Describe the vibes..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
             />
          </div>

          <div className="pt-4 mt-2">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-xl font-black uppercase tracking-wider py-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 border-2 border-black"
            >
                Post This Bop
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};