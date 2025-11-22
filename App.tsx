import React, { useState, useMemo } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { BopCard } from './components/BopCard';
import { CreateBopModal } from './components/CreateBopModal';
import { Button } from './components/Button';
import { User, BopProfile, CreateBopFormData } from './types';
import { MOCK_BOPS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bops, setBops] = useState<BopProfile[]>(MOCK_BOPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'local' | 'global'>('local');

  const handleLogin = (userData: Omit<User, 'isAuthenticated'>) => {
    setUser({ ...userData, isAuthenticated: true });
  };

  const handleLogout = () => {
    setUser(null);
    setViewMode('local');
  };

  const handleCreateBop = (data: CreateBopFormData, imageFile: File) => {
    const newBop: BopProfile = {
      id: Date.now().toString(),
      ...data,
      imageUrl: URL.createObjectURL(imageFile),
      voteCount: 1,
      totalScore: data.rating,
      createdAt: Date.now(),
      authorEmail: user?.email,
    };
    setBops([newBop, ...bops]);
  };

  const handleVote = (id: string, userRating: number) => {
    setBops(currentBops => currentBops.map(bop => {
      if (bop.id === id) {
        const newTotal = bop.totalScore + userRating;
        const newCount = bop.voteCount + 1;
        // Calculate new average and round to 1 decimal
        const newAverage = Math.round((newTotal / newCount) * 10) / 10;
        return {
          ...bop,
          totalScore: newTotal,
          voteCount: newCount,
          rating: newAverage
        };
      }
      return bop;
    }));
  };

  const filteredBops = useMemo(() => {
    let data = bops;

    // Filter by View Mode (Community Isolation)
    if (viewMode === 'local' && user) {
      data = data.filter(bop => bop.school === user.school);
    }

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(bop => 
        bop.name.toLowerCase().includes(query) || 
        bop.school.toLowerCase().includes(query) ||
        bop.year.toLowerCase().includes(query)
      );
    }
    return data;
  }, [bops, searchQuery, viewMode, user]);

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between">
              <div 
                className="cursor-pointer" 
                onClick={() => {
                  window.scrollTo(0,0);
                  setViewMode('local');
                }}
              >
                <h1 className="text-2xl font-black italic tracking-tighter text-black leading-none">
                  BeeBop.
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-bee-500">
                  {user.school} Edition
                </span>
              </div>
              
              {/* Mobile Profile/Logout */}
              <div className="flex items-center sm:hidden gap-3">
                 {user.profilePicUrl ? (
                   <img src={user.profilePicUrl} alt={user.username} className="w-8 h-8 rounded-full border border-black object-cover" />
                 ) : (
                   <div className="w-8 h-8 rounded-full bg-bee-300 border border-black flex items-center justify-center text-xs font-bold text-black">
                     {user.username.charAt(0).toUpperCase()}
                   </div>
                 )}
                 <button onClick={handleLogout} className="text-xs font-bold underline text-black">Logout</button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 sm:mx-8 relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </div>
               <input 
                 type="text"
                 placeholder={viewMode === 'local' ? `Search ${user.school}...` : "Search all colleges..."}
                 className="w-full pl-10 pr-4 py-2 bg-gray-100 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none font-bold transition-all text-sm text-black"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>

            {/* Desktop Profile */}
            <div className="hidden sm:flex items-center gap-3">
               <div className="flex items-center gap-2">
                  <div className="text-right hidden md:block">
                     <div className="text-xs font-bold text-black">{user.username}</div>
                  </div>
                  {user.profilePicUrl ? (
                    <img src={user.profilePicUrl} alt={user.username} className="w-9 h-9 rounded-full border-2 border-black object-cover shadow-sm" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-bee-300 border-2 border-black flex items-center justify-center text-sm font-bold shadow-sm text-black">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
               </div>
               
               <button onClick={handleLogout} className="text-xs font-bold text-gray-500 hover:text-black ml-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
               </button>
            </div>
          </div>

          {/* Community Toggles */}
          <div className="flex gap-2 mt-4 sm:mt-2 border-t border-gray-200 pt-2 sm:border-0 sm:pt-0">
            <button 
              onClick={() => setViewMode('local')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                viewMode === 'local' 
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(251,191,36,1)]' 
                : 'bg-transparent text-gray-500 hover:bg-gray-100'
              }`}
            >
              My Campus
            </button>
            <button 
              onClick={() => setViewMode('global')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all ${
                viewMode === 'global' 
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(251,191,36,1)]' 
                : 'bg-transparent text-gray-500 hover:bg-gray-100'
              }`}
            >
              Global Hive
            </button>
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {filteredBops.length > 0 ? (
           filteredBops.map(bop => (
             <BopCard key={bop.id} bop={bop} onVote={handleVote} />
           ))
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏫</div>
            <h3 className="text-xl font-black mb-2 text-black">
              {viewMode === 'local' ? `Quiet at ${user.school}` : "No Bops Found"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {viewMode === 'local' 
                ? "Nobody has been rated yet! Be the legend who starts the trend at your school." 
                : "Looks like a dry spell across the nation."}
            </p>
            {viewMode === 'local' && (
               <Button 
                 onClick={() => setIsModalOpen(true)}
                 className="mt-6 bg-bee-300 hover:bg-bee-400"
               >
                 Start the Wave
               </Button>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button - POST BUTTON */}
      <div className="fixed bottom-8 right-8 z-40">
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="rounded-full px-8 py-5 flex items-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-black text-bee-400 border-4 border-bee-400 hover:bg-gray-900 hover:scale-105 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all duration-300 group"
        >
           <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
           <span className="font-black text-2xl tracking-widest uppercase">Post Bop</span>
        </Button>
      </div>

      <CreateBopModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateBop}
        userSchool={user.school}
      />
    </div>
  );
};

export default App;