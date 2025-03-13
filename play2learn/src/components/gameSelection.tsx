import React, { useState } from 'react';
import { Star, Clock, Trophy, Users, ArrowRight, Search, Filter, X } from 'lucide-react';

interface Game {
  id: number;
  name: string;
  icon: string;
  description: string;
  difficulty: string;
}

interface GameSelectionProps {
  games: Game[];
  selectedLanguage: string;
}

const GameSelection: React.FC<GameSelectionProps> = ({ games, selectedLanguage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Games: {selectedLanguage}</h1>
        
        {/* Desktop Filters */}
        <div className="hidden md:flex space-x-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFilter === 'all' ? 'bg-indigo-800 text-white' : 'bg-indigo-900/50 hover:bg-indigo-800 text-white'
            }`}
          >
            All Games
          </button>
          <button 
            onClick={() => setActiveFilter('popular')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFilter === 'popular' ? 'bg-indigo-800 text-white' : 'bg-indigo-900/50 hover:bg-indigo-800 text-white'
            }`}
          >
            Popular
          </button>
          <button 
            onClick={() => setActiveFilter('new')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFilter === 'new' ? 'bg-indigo-800 text-white' : 'bg-indigo-900/50 hover:bg-indigo-800 text-white'
            }`}
          >
            New
          </button>
        </div>
        
        {/* Mobile Filter Button */}
        <button 
          className="md:hidden flex items-center justify-center px-4 py-2 bg-indigo-800 rounded-lg"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} className="mr-2" />
          Filters
        </button>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <div className="md:hidden mb-4 bg-indigo-900/50 p-3 rounded-lg border border-indigo-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Filter Games</h3>
            <button onClick={() => setShowFilters(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'all' ? 'bg-indigo-700 text-white' : 'bg-indigo-800/50 text-indigo-300'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('popular')}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'popular' ? 'bg-indigo-700 text-white' : 'bg-indigo-800/50 text-indigo-300'
              }`}
            >
              Popular
            </button>
            <button 
              onClick={() => setActiveFilter('new')}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'new' ? 'bg-indigo-700 text-white' : 'bg-indigo-800/50 text-indigo-300'
              }`}
            >
              New
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-indigo-400" />
        </div>
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {filteredGames.length > 0 ? (
          filteredGames.map(game => (
            <div key={game.id} className="bg-indigo-800/40 rounded-xl overflow-hidden border border-indigo-700 hover:shadow-lg hover:shadow-purple-900/20 transition-all group">
              <div className="h-32 md:h-40 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-5xl md:text-6xl">{game.icon}</span>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg md:text-xl font-bold">{game.name}</h2>
                  <div className="bg-indigo-700 px-3 py-1 rounded-full text-sm flex items-center">
                    <Star size={14} className="mr-1 text-yellow-400" />
                    <span>{game.difficulty}</span>
                  </div>
                </div>
                <p className="text-indigo-300 mt-2 text-sm md:text-base">{game.description}</p>
                
                <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex space-x-3 mb-3 md:mb-0">
                    <div className="flex items-center text-indigo-300 text-xs md:text-sm">
                      <Trophy size={14} className="mr-1 text-yellow-400" />
                      <span>250 XP</span>
                    </div>
                    <div className="flex items-center text-indigo-300 text-xs md:text-sm">
                      <Clock size={14} className="mr-1" />
                      <span>~5 min</span>
                    </div>
                    <div className="flex items-center text-indigo-300 text-xs md:text-sm">
                      <Users size={14} className="mr-1" />
                      <span>1-4</span>
                    </div>
                  </div>
                  
                  <button className="w-full md:w-auto bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center md:justify-start transition-all shadow-md shadow-purple-900/30 group-hover:shadow-lg">
                    Play
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 bg-indigo-800/20 rounded-xl p-6 border border-indigo-700 text-center">
            <p className="text-indigo-300">No games match your search. Try different keywords!</p>
          </div>
        )}
      </div>
      
      {/* Daily Challenge */}
      <div className="mt-8 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 rounded-xl p-4 md:p-6 border border-indigo-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Daily Challenge</h2>
            <p className="text-indigo-300 mt-1 text-sm md:text-base">Complete today's special mini-game for bonus XP!</p>
          </div>
          
          <button className="w-full md:w-auto bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white px-5 py-3 rounded-lg font-medium flex items-center justify-center transition-all shadow-lg shadow-amber-900/30">
            Start Challenge
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
        
        <div className="mt-4 flex items-center">
          <div className="flex-1 h-2 bg-indigo-950/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500" style={{ width: '35%' }}></div>
          </div>
          <div className="ml-3 text-amber-400 font-medium text-sm">35% completed</div>
        </div>
      </div>
      
      {/* Quick Play Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
          <ArrowRight size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default GameSelection;