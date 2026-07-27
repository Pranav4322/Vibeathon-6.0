"use client";

import { useState } from "react";
import { Sparkles, Trophy, Frown, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TriviaData {
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
}

type GameState = "idle" | "loading" | "playing" | "won" | "lost";

export function GamifiedWaitCard() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [triviaData, setTriviaData] = useState<TriviaData | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startGame = async () => {
    setGameState("loading");
    setError(null);
    try {
      const res = await fetch("/api/ai/trivia", { method: "POST" });
      if (!res.ok) throw new Error("Failed to fetch trivia");
      const data = await res.json();
      setTriviaData(data);
      setGameState("playing");
    } catch (err) {
      setError("Failed to load game. Our AI is taking a coffee break!");
      setGameState("idle");
    }
  };

  const handleSelect = (index: number) => {
    if (gameState !== "playing" || !triviaData) return;
    
    setSelectedOption(index);
    
    // Slight delay for suspense
    setTimeout(() => {
      if (index === triviaData.correctIndex) {
        setGameState("won");
      } else {
        setGameState("lost");
      }
    }, 1000);
  };

  if (gameState === "idle" || gameState === "loading") {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>
          <h3 className="font-bold text-indigo-900 text-lg mb-1">Waiting for your food?</h3>
          <p className="text-sm text-indigo-700/80 mb-4 max-w-xs">
            Play a quick round of Food Trivia to win a 5% discount code for dessert!
          </p>
          
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          
          <Button
            onClick={startGame}
            disabled={gameState === "loading"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 w-full max-w-[200px]"
          >
            {gameState === "loading" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2 fill-current" />
            )}
            {gameState === "loading" ? "Loading Game..." : "Play Now"}
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === "playing" && triviaData) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-stone-800 flex-1">Food Trivia</h3>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
            Win 5% Off
          </span>
        </div>
        
        <p className="text-stone-700 font-medium mb-4 text-sm leading-relaxed">
          {triviaData.question}
        </p>
        
        <div className="space-y-2">
          {triviaData.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selectedOption !== null}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 scale-[0.98]"
                    : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300 disabled:opacity-50"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if ((gameState === "won" || gameState === "lost") && triviaData) {
    const isWin = gameState === "won";
    
    return (
      <div className={`border rounded-2xl p-5 shadow-sm transition-all duration-500 ${
        isWin ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100" : "bg-stone-50 border-stone-200"
      }`}>
        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full shadow-sm flex items-center justify-center mb-4 ${
            isWin ? "bg-emerald-100 text-emerald-600" : "bg-stone-200 text-stone-500"
          }`}>
            {isWin ? <Trophy className="w-7 h-7" /> : <Frown className="w-7 h-7" />}
          </div>
          
          <h3 className={`font-bold text-lg mb-1 ${isWin ? "text-emerald-800" : "text-stone-800"}`}>
            {isWin ? "You got it right! 🎉" : "Oh no, incorrect! 😅"}
          </h3>
          
          <p className="text-sm text-stone-600 mb-4 max-w-[280px]">
            {isWin 
              ? "Enjoy your sweet reward. Show this code to your waiter when ordering dessert:" 
              : "No discount this time, but here's the fun fact anyway:"}
          </p>
          
          {isWin && (
            <div className="bg-white border-2 border-dashed border-emerald-300 rounded-xl px-6 py-3 mb-4 inline-block">
              <span className="font-mono text-xl font-bold tracking-widest text-emerald-600">
                SWEET5
              </span>
            </div>
          )}
          
          <div className={`text-xs p-3 rounded-lg text-left ${
            isWin ? "bg-emerald-100/50 text-emerald-800" : "bg-stone-200/50 text-stone-700"
          }`}>
            <span className="font-bold">Did you know?</span> {triviaData.funFact}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
