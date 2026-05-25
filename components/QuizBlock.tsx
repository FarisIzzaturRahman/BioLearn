'use client';

import { useState } from 'react';
import { Check, X, Award, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';

interface Option {
  label: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  question: string;
  options: Option[];
  explanation: string;
}

interface QuizBlockProps {
  markdown: string;
}

export function parseQuiz(markdown: string): QuizQuestion[] {
  const lines = markdown.split('\n');
  const questions: QuizQuestion[] = [];
  let currentQuestion: Partial<QuizQuestion> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect Question (e.g. "Q1: Apa itu DNA?")
    const qMatch = line.match(/^Q(\d+):\s*(.*)/i);
    if (qMatch) {
      if (currentQuestion && currentQuestion.question && currentQuestion.options && currentQuestion.options.length > 0) {
        questions.push(currentQuestion as QuizQuestion);
      }
      currentQuestion = {
        question: qMatch[2].trim(),
        options: [],
        explanation: ''
      };
      continue;
    }

    // Detect Option (e.g. "A) Adenine")
    const optMatch = line.match(/^([A-D])\)\s*(.*)/i);
    if (optMatch && currentQuestion) {
      const label = optMatch[1].toUpperCase();
      let text = optMatch[2].trim();
      const isCorrect = text.includes('✓') || text.includes('v');
      
      // Clean up checkmarks from visual option text
      text = text.replace(/[✓v]/g, '').trim();
      
      currentQuestion.options = currentQuestion.options || [];
      currentQuestion.options.push({ label, text, isCorrect });
      continue;
    }

    // Detect Explanation (e.g. "Explanation: DNA stands for...")
    const expMatch = line.match(/^Explanation:\s*(.*)/i);
    if (expMatch && currentQuestion) {
      currentQuestion.explanation = expMatch[1].trim();
      continue;
    }
  }

  // Push final question if available
  if (currentQuestion && currentQuestion.question && currentQuestion.options && currentQuestion.options.length > 0) {
    questions.push(currentQuestion as QuizQuestion);
  }

  return questions;
}

export default function QuizBlock({ markdown }: QuizBlockProps) {
  const questions = parseQuiz(markdown);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentIdx];

  const handleOptionClick = (option: Option) => {
    if (selectedOption !== null) return; // Prevent multiple answers
    setSelectedOption(option);
    setShowExplanation(true);
    if (option.isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
    setIsFinished(false);
  };

  // Render Finished State
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let feedback = 'Keep practicing!';
    let feedbackColor = 'text-yellow-600';
    if (percentage === 100) {
      feedback = 'Sempurna! You have fully mastered this topic!';
      feedbackColor = 'text-green-600';
    } else if (percentage >= 70) {
      feedback = 'Hebat! You have a strong grasp of the material!';
      feedbackColor = 'text-blue-600';
    }

    return (
      <div className="my-8 p-8 border border-gray-200 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <Award className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Quiz Completed!</h3>
          <p className="text-gray-500 font-semibold text-sm">Here is your performance summary:</p>
        </div>

        {/* Score Ring */}
        <div className="inline-block relative p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-4xl font-extrabold text-blue-600">
            {score} <span className="text-gray-400 text-2xl font-medium">/ {questions.length}</span>
          </div>
          <div className="text-xs text-gray-400 font-bold tracking-wider uppercase mt-1">Total Score</div>
        </div>

        <p className={`text-base font-bold ${feedbackColor}`}>{feedback}</p>

        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="my-8 border border-gray-200 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto overflow-hidden">
      
      {/* Top Progress Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          Interactive Quiz
        </span>
        <span className="text-xs font-bold text-gray-500">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      {/* Progress Bar indicator */}
      <div className="w-full bg-gray-100 h-1">
        <div 
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="p-6 space-y-6">
        <h4 className="text-lg font-bold text-gray-900 leading-snug">
          {currentQuestion.question}
        </h4>

        {/* Options list */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const hasAnswered = selectedOption !== null;
            
            let btnStyle = 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/20 text-gray-700';
            let iconElement = null;

            if (hasAnswered) {
              if (opt.isCorrect) {
                // Correct option highlight
                btnStyle = 'border-green-300 bg-green-50 text-green-800 font-semibold';
                iconElement = <Check className="w-5 h-5 text-green-600 flex-shrink-0" />;
              } else if (isSelected) {
                // Wrong selected option highlight
                btnStyle = 'border-red-300 bg-red-50 text-red-800';
                iconElement = <X className="w-5 h-5 text-red-600 flex-shrink-0" />;
              } else {
                // Dim down other unselected options
                btnStyle = 'border-gray-100 opacity-60 text-gray-400';
              }
            }

            return (
              <button
                key={i}
                disabled={hasAnswered}
                onClick={() => handleOptionClick(opt)}
                className={`w-full flex items-center justify-between text-left p-4 rounded-xl border text-sm font-semibold transition-all duration-150 ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    isSelected ? 'bg-blue-600 text-white' : 
                    hasAnswered && opt.isCorrect ? 'bg-green-600 text-white' : 
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {opt.label}
                  </span>
                  <span>{opt.text}</span>
                </div>
                {iconElement}
              </button>
            );
          })}
        </div>

        {/* Explanation Text Box */}
        {showExplanation && currentQuestion.explanation && (
          <div className="bg-blue-50/80 border-l-4 border-blue-500 p-4 rounded-r-xl space-y-1 animate-float-subtle">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Explanation</span>
            <p className="text-sm text-blue-900 leading-relaxed font-semibold">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      {selectedOption !== null && (
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all duration-200"
          >
            {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
