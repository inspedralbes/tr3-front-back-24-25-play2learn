"use client";
import React from 'react';
import { Trophy, Star, Clock, Calendar, Award, Zap, BarChart3, Target, ChevronDown } from 'lucide-react';
import {NavBarContext} from "@/contexts/NavBarContext";
import { useContext, useEffect } from "react";

const ProfileSection: React.FC = () => {
  const { selectedLanguage, setActiveSection } = useContext(NavBarContext);
  
  useEffect(() => {
    setActiveSection('profile');
  }, []);

  const achievements = [
    { id: 1, name: 'First Victory', icon: '🏆', description: 'Win your first game', completed: true },
    { id: 2, name: 'Vocabulary Master', icon: '📚', description: 'Learn 100 words', completed: true },
    { id: 3, name: 'Perfect Score', icon: '⭐', description: 'Get 100% in any game', completed: true },
    { id: 4, name: 'Speed Demon', icon: '⚡', description: 'Complete a game in under 1 minute', completed: false },
    { id: 5, name: 'Polyglot', icon: '🌍', description: 'Study 3 different languages', completed: false },
    { id: 6, name: 'Streak Master', icon: '🔥', description: 'Maintain a 30-day streak', completed: false },
  ];

  const stats = [
    { name: 'Games Played', value: 42, icon: <Trophy size={20} className="text-purple-400" /> },
    { name: 'Win Rate', value: '68%', icon: <Target size={20} className="text-green-400" /> },
    { name: 'Total XP', value: 3750, icon: <Zap size={20} className="text-yellow-400" /> },
    { name: 'Words Learned', value: 215, icon: <BarChart3 size={20} className="text-blue-400" /> },
  ];

  const recentGames = [
    { id: 1, game: 'Word Match', score: 850, date: '2 hours ago', result: 'win' },
    { id: 2, game: 'Sentence Builder', score: 720, date: 'Yesterday', result: 'win' },
    { id: 3, game: 'Speed Vocab', score: 540, date: '3 days ago', result: 'loss' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Profile: {selectedLanguage}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Profile Card - Full width on mobile */}
        <div className="md:col-span-1">
          <div className="bg-indigo-800/40 rounded-xl p-4 md:p-6 border border-indigo-700">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl md:text-3xl font-bold mb-4">
                LP
              </div>
              <h2 className="text-xl font-bold">LanguagePlayer</h2>
              <p className="text-indigo-300 text-sm">Joined 3 months ago</p>
              
              <div className="mt-4 flex items-center">
                <Star className="text-yellow-400 mr-1" size={16} />
                <span className="font-medium">Level 7</span>
              </div>
              
              <div className="mt-3 w-full bg-indigo-950/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                  style={{ width: '70%' }}
                ></div>
              </div>
              <p className="text-xs text-indigo-300 mt-1">3750 / 5000 XP</p>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <div key={index} className="bg-indigo-900/50 rounded-lg p-3 flex flex-col items-center">
                  {stat.icon}
                  <div className="mt-2 font-bold">{stat.value}</div>
                  <div className="text-xs text-indigo-300">{stat.name}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <Clock size={16} className="mr-1 text-indigo-300" />
                <span className="text-sm text-indigo-300">Last active: Today</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1 text-indigo-300" />
                <span className="text-sm text-indigo-300">Streak: 7 days</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements and Recent Games - Full width on mobile */}
        <div className="md:col-span-2 space-y-4 md:space-y-6">
          {/* Achievements */}
          <div className="bg-indigo-800/40 rounded-xl p-4 md:p-6 border border-indigo-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Trophy className="mr-2 text-yellow-400" size={20} />
                Achievements
              </h2>
              <button className="text-indigo-300 flex items-center text-sm">
                View All
                <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {achievements.slice(0, 6).map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`p-3 md:p-4 rounded-lg border ${
                    achievement.completed 
                      ? 'bg-indigo-700/50 border-indigo-600' 
                      : 'bg-indigo-900/30 border-indigo-800 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl md:text-2xl">{achievement.icon}</span>
                    {achievement.completed && (
                      <Award size={16} className="text-yellow-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm md:text-base">{achievement.name}</h3>
                  <p className="text-xs text-indigo-300 mt-1">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Games */}
          <div className="bg-indigo-800/40 rounded-xl p-4 md:p-6 border border-indigo-700">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Recent Games
            </h2>
            
            <div className="space-y-3">
              {recentGames.map(game => (
                <div key={game.id} className="flex items-center p-3 md:p-4 bg-indigo-900/30 rounded-lg">
                  <div className={`w-2 h-10 md:h-12 rounded-full mr-3 md:mr-4 ${
                    game.result === 'win' ? 'bg-green-500' : 'bg-red- 500'
                  }`}></div>
                  <div>
                    <h3 className="font-medium">{game.game}</h3>
                    <p className="text-xs text-indigo-300">{game.date}</p>
                  </div>
                  <div className="ml-auto">
                    <div className="font-bold text-right">{game.score} pts</div>
                    <div className={`text-xs text-right ${
                      game.result === 'win' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {game.result === 'win' ? 'Victory' : 'Defeat'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-all">
              View Game History
            </button>
          </div>
          
          {/* Language Progress */}
          <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 rounded-xl p-4 md:p-6 border border-indigo-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Language Progress</h2>
                <p className="text-indigo-300 mt-1 text-sm md:text-base">Track your learning journey in {selectedLanguage}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              {[
                { category: 'Vocabulary', progress: 65 },
                { category: 'Grammar', progress: 40 },
                { category: 'Listening', progress: 75 },
                { category: 'Speaking', progress: 30 },
              ].map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{skill.category}</span>
                    <span className="text-sm text-indigo-300">{skill.progress}%</span>
                  </div>
                  <div className="h-2 bg-indigo-950/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;