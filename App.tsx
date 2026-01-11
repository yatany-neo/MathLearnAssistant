
import React, { useState } from 'react';
import { MathTopic, MathModel } from './types';
import { INITIAL_MODELS } from './constants';
import InteractiveTutor from './components/InteractiveTutor';

const App: React.FC = () => {
  const [models] = useState<MathModel[]>(INITIAL_MODELS);
  const [selectedModel, setSelectedModel] = useState<MathModel | null>(null);
  const [activeTab, setActiveTab] = useState<MathTopic | 'ALL'>('ALL');

  const filteredModels = activeTab === 'ALL' 
    ? models 
    : models.filter(m => m.topic === activeTab);

  return (
    <div className="min-h-screen pb-20 relative">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-100">
              ∑
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">数学魔方 <span className="text-blue-600">5.0</span></h1>
              <p className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full inline-block">5年级专项强化版</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <button className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">核心模型库</button>
              <button className="text-sm font-medium text-gray-400 hover:text-gray-800 transition-colors">学习记录</button>
            </nav>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-b from-blue-50 to-white pt-12 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            攻克五年级数学<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">所有难题</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            我们精选了五年级最具挑战性的几何与应用题模型，通过分步互动，让孩子真正理解“为什么”而不是“怎么算”。
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 -mt-10">
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === 'ALL' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100'}`}
          >
            全集
          </button>
          {Object.values(MathTopic).map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTab(topic)}
              className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${activeTab === topic ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100'}`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModels.map((model) => (
            <div 
              key={model.id}
              className="math-card bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl hover:border-blue-200 cursor-pointer transition-all group animate-in zoom-in"
              onClick={() => setSelectedModel(model)}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                    {model.topic}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-yellow-50 group-hover:bg-yellow-100 flex items-center justify-center transition-colors">
                    {model.id.includes('geometry') ? '📐' : '💡'}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors leading-snug tracking-tight">{model.title}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">{model.description}</p>
                
                <div className="bg-gray-50 rounded-3xl p-6 mb-6 border border-gray-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                  <p className="text-[10px] font-black text-gray-400 mb-3 tracking-widest uppercase">今日挑战：</p>
                  <p className="text-gray-700 text-sm italic font-medium leading-relaxed line-clamp-3">“{model.exampleProblem}”</p>
                </div>
              </div>

              <button 
                className="w-full py-5 bg-gray-900 group-hover:bg-blue-600 text-white font-black text-lg rounded-2xl transition-all shadow-lg shadow-gray-200 group-hover:shadow-blue-200 active:scale-95"
              >
                进入互动讲解
              </button>
            </div>
          ))}
        </div>
      </main>

      {selectedModel && (
        <InteractiveTutor 
          model={selectedModel} 
          onClose={() => setSelectedModel(null)} 
        />
      )}

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 text-gray-800 px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center space-x-4">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-sm font-bold tracking-tight">AI 辅导引擎已就绪</span>
        </div>
      </div>
    </div>
  );
};

export default App;
