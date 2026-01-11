
import React, { useState, useEffect, useRef } from 'react';
import { MathModel, Step } from '../types';
import { validateAnswer, generateNewProblem } from '../services/geminiService';

interface Props {
  model: MathModel;
  onClose: () => void;
}

const InteractiveTutor: React.FC<Props> = ({ model, onClose }) => {
  const [stage, setStage] = useState<'LEARNING' | 'TRANSITION' | 'CHALLENGING'>('LEARNING');
  const [challengeMode, setChallengeMode] = useState<'GUIDED' | 'SOLO'>('GUIDED');
  
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [challengeData, setChallengeData] = useState<{ problem: string; steps: Step[] } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isChallenging = stage === 'CHALLENGING';
  const isSolo = isChallenging && challengeMode === 'SOLO';
  const isTransition = stage === 'TRANSITION';
  
  const displayProblem = isChallenging && challengeData ? challengeData.problem : model.exampleProblem;
  const activeSteps = isChallenging && challengeData ? challengeData.steps : model.steps;
  
  // 挑战模式下，我们要解决的是这一组步骤中的最后一个终极问题
  const currentStep = isSolo 
    ? activeSteps[activeSteps.length - 1] 
    : activeSteps[currentStepIdx];

  const isSegmentedModel = model.title.includes('停车') || model.title.includes('分段') || model.title.includes('计费');

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [currentStepIdx, feedback, stage, challengeMode]);

  const handleStepSubmit = async () => {
    if (!userInput.trim() || !currentStep || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await validateAnswer(
        isSolo ? (displayProblem + " " + currentStep.question) : currentStep.question, 
        userInput, 
        currentStep.correctAnswer
      );
      
      setFeedback({ isCorrect: result.isCorrect, text: result.feedback });
      
      if (result.isCorrect) {
        setTimeout(() => {
          if (!isSolo && currentStepIdx < activeSteps.length - 1) {
            setCurrentStepIdx(prev => prev + 1);
            setUserInput('');
            setFeedback(null);
          } else {
            if (stage === 'LEARNING') {
              setStage('TRANSITION');
            } else {
              setFeedback({ isCorrect: true, text: `🎉 ${isSolo ? '闯关成功！你独立解决了这个难题！' : '引导挑战成功！你学得很扎实！'}` });
              setTimeout(() => {
                setStage('TRANSITION');
                setChallengeData(null);
              }, 3000);
            }
          }
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChallenge = async (mode: 'GUIDED' | 'SOLO') => {
    if (isLoading) return;
    setIsLoading(true);
    setFeedback(null);
    setChallengeMode(mode);
    try {
      const data = await generateNewProblem(model.title);
      setChallengeData(data);
      setCurrentStepIdx(0);
      setUserInput('');
      setStage('CHALLENGING'); 
    } catch (error) {
      alert("AI老师稍微迟到了，请重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const renderVisualModel = () => {
    if (!isSegmentedModel || isSolo || isTransition) return null;

    return (
      <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 mb-6 animate-in fade-in duration-700">
        <p className="text-[10px] font-black text-slate-400 mb-4 tracking-widest uppercase text-center">数据建模·可视化辅助</p>
        <div className="relative h-20 flex flex-col justify-center">
          <div className="absolute w-full h-1 bg-slate-200 rounded-full top-1/2 -translate-y-1/2"></div>
          <div className="relative flex w-full h-10 items-center">
            <div className={`relative h-6 bg-blue-500 rounded-l-full transition-all duration-700 flex items-center justify-center text-[10px] text-white font-bold border-r-2 border-white shadow-lg ${currentStepIdx >= 0 ? 'w-[30%] opacity-100' : 'w-0 opacity-0'}`}>
              <span className="absolute -top-6 text-blue-600 font-black">固定/基础</span>
            </div>
            <div className={`relative h-6 bg-purple-500 rounded-r-full transition-all duration-700 delay-300 flex items-center justify-center text-[10px] text-white font-bold shadow-lg ${currentStepIdx >= 1 ? 'w-[60%] opacity-100' : 'w-[10%] opacity-20'}`}>
              <span className="absolute -top-6 text-purple-600 font-black">超额/变动</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in duration-300 relative border-8 transition-colors duration-500 ${isSolo ? 'border-amber-400' : 'border-white'}`}>
        
        {isLoading && !userInput && (
          <div className="absolute inset-0 bg-white/95 z-[70] flex flex-col items-center justify-center animate-in fade-in">
            <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4 ${isSolo ? 'border-amber-500' : 'border-indigo-600'}`}></div>
            <p className={`text-lg font-black ${isSolo ? 'text-amber-600' : 'text-indigo-600'}`}>AI老师正在为你准备内容...</p>
          </div>
        )}

        {/* Header */}
        <div className={`px-8 py-5 border-b flex justify-between items-center transition-all ${isSolo ? 'bg-amber-500 text-amber-950 border-amber-600' : isChallenging ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'}`}>
          <div className="flex items-center space-x-4">
            <span className="text-2xl">{isSolo ? '🏆' : isChallenging ? '🎯' : '💡'}</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                {isSolo ? '闯关挑战模式' : isChallenging ? '引导挑战模式' : '例题讲解模式'}
              </p>
              <h2 className="text-xl font-black">{model.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-all">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div ref={contentRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth scrollbar-hide">
          {isTransition ? (
            <div className="text-center py-8 space-y-8">
              <div className="text-8xl animate-bounce">🎊</div>
              <h3 className="text-3xl font-black text-slate-900">准备好迎接挑战了吗？</h3>
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                <button 
                  onClick={() => startNewChallenge('GUIDED')}
                  className="p-6 bg-indigo-50 border-4 border-indigo-200 rounded-[2rem] text-left hover:border-indigo-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🌱</span>
                    <span className="text-[10px] font-black text-indigo-400 uppercase">有提示</span>
                  </div>
                  <h4 className="font-black text-indigo-900 text-lg">步骤引导模式</h4>
                  <p className="text-xs text-indigo-600/70 font-medium">老师会陪你拆解每一步并提供可视化提示。</p>
                </button>

                <button 
                  onClick={() => startNewChallenge('SOLO')}
                  className="p-6 bg-amber-50 border-4 border-amber-200 rounded-[2rem] text-left hover:border-amber-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">👑</span>
                    <span className="text-[10px] font-black text-amber-500 uppercase">无提示</span>
                  </div>
                  <h4 className="font-black text-amber-900 text-lg">闯关挑战模式</h4>
                  <p className="text-xs text-amber-600/70 font-medium">直接面对最终问题，像真正的数学家一样独立思考！</p>
                </button>
              </div>
              <button onClick={onClose} className="text-slate-400 font-bold hover:text-slate-600 underline underline-offset-4 decoration-slate-200">稍后再试，先回主页</button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className={`p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden transition-all duration-500 ${isSolo ? 'bg-slate-800 ring-8 ring-amber-400/20' : isChallenging ? 'bg-indigo-500' : 'bg-blue-500'}`}>
                <h4 className="text-[10px] font-black opacity-60 mb-2 uppercase tracking-widest">问题场景</h4>
                <p className="text-xl font-bold leading-relaxed">{displayProblem}</p>
              </div>

              {renderVisualModel()}

              {currentStep && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  {!isSolo ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg ${isChallenging ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                          {currentStepIdx + 1}
                        </div>
                        <h5 className="text-lg font-black text-slate-800">{currentStep.title}</h5>
                      </div>
                      <div className={`p-6 rounded-2xl border-l-8 text-lg ${isChallenging ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-sm' : 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm'}`}>
                        {currentStep.explanation}
                      </div>
                    </>
                  ) : (
                    <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-200 flex items-center space-x-4 shadow-sm">
                      <span className="text-4xl">👨‍🏫</span>
                      <div className="flex-1">
                        <p className="text-amber-900 font-black mb-1">终极挑战目标：</p>
                        <p className="text-amber-800 font-bold leading-relaxed text-base">
                          请根据上面的场景信息，计算出：<span className="underline decoration-amber-400 underline-offset-4">{currentStep.question}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className={`bg-white border-4 p-8 rounded-[3rem] shadow-xl space-y-4 transition-all ${isSolo ? 'border-amber-500 shadow-amber-100' : isChallenging ? 'border-indigo-600' : 'border-blue-600'}`}>
                    <p className="font-black text-slate-800 text-xl">
                      你的回答：
                    </p>
                    <input
                      type="text"
                      autoFocus
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStepSubmit()}
                      placeholder={isSolo ? "输入最终计算出的数字..." : "写下你的答案..."}
                      disabled={isLoading || (feedback?.isCorrect ?? false)}
                      className={`w-full px-8 py-5 bg-slate-50 border-4 border-transparent rounded-2xl text-2xl font-black outline-none focus:bg-white transition-all ${isSolo ? 'focus:border-amber-400 text-amber-900' : 'focus:border-blue-400 text-blue-900'}`}
                    />
                    
                    {feedback && (
                      <div className={`p-6 rounded-2xl flex items-start space-x-4 animate-in fade-in ${feedback.isCorrect ? 'bg-green-500 text-white' : 'bg-rose-100 text-rose-900 border-2 border-rose-200'}`}>
                        <span className="text-3xl">{feedback.isCorrect ? '🌟' : '🧐'}</span>
                        <div>
                          <p className="font-black text-lg mb-1">{feedback.isCorrect ? '太棒了！' : '老师的建议：'}</p>
                          <p className="font-bold leading-relaxed">{feedback.text}</p>
                        </div>
                      </div>
                    )}

                    {!feedback?.isCorrect && (
                      <button 
                        onClick={handleStepSubmit}
                        disabled={isLoading || !userInput.trim()}
                        className={`w-full py-5 text-white font-black text-xl rounded-2xl transition-all active:scale-95 shadow-lg ${isSolo ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : isChallenging ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {isLoading ? '核对中...' : isSolo ? '提交闯关答案' : '提交当前步骤'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {!isTransition && (
          <div className="px-10 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {stage === 'LEARNING' && (
                <button 
                  onClick={() => setStage('TRANSITION')} 
                  className="text-xs font-black text-blue-600 underline decoration-blue-200 underline-offset-4 hover:text-indigo-600 transition-colors"
                >
                  ⏩ 跳过例题，开启挑战
                </button>
              )}
              <div className="flex space-x-1.5">
                {isSolo ? (
                  <div className="flex items-center space-x-2 text-amber-600 font-black text-[10px] uppercase tracking-widest">
                    <span className="animate-pulse">●</span> SOLO MODE
                  </div>
                ) : (
                  activeSteps.map((_, idx) => (
                    <div key={idx} className={`h-2 rounded-full transition-all duration-500 ${idx === currentStepIdx ? 'w-8 bg-blue-600' : idx < currentStepIdx ? 'w-2 bg-green-500' : 'w-2 bg-slate-200'}`} />
                  ))
                )}
              </div>
            </div>
            <span className={`text-xs font-black uppercase tracking-widest ${isSolo ? 'text-amber-600' : 'text-slate-400'}`}>
              {isSolo ? 'FINAL STAGE' : `STEP ${currentStepIdx + 1}/${activeSteps.length}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveTutor;
