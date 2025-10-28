import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Building2, TrendingUp } from 'lucide-react';
import Trianglify from 'trianglify';

interface BusinessSelectorProps {
  onSelectBusiness: () => void;
  isDarkMode?: boolean;
}

export function BusinessSelector({ onSelectBusiness, isDarkMode = false }: BusinessSelectorProps) {
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const [currentDraw, setCurrentDraw] = useState(1);

  useEffect(() => {
    const width = Math.max(window.innerWidth || 1920, 100);
    const height = Math.max(window.innerHeight || 1080, 100);

    const redPalettes = [
      ['#8B0000', '#DC143C', '#FF6347', '#FF4500', '#FF8C00'],
      ['#B22222', '#CD5C5C', '#F08080', '#FA8072', '#E9967A'],
      ['#8B008B', '#9932CC', '#BA55D3', '#DA70D6', '#EE82EE'],
      ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1'],
      ['#800000', '#A52A2A', '#B8860B', '#CD853F', '#D2691E'],
      ['#DC143C', '#FF0000', '#FF4500', '#FF6347', '#FF7F50'],
    ];

    const generatePattern = (draw: number) => {
      const palette = redPalettes[Math.floor(Math.random() * redPalettes.length)];
      
      const validWidth = Math.max(width, 100);
      const validHeight = Math.max(height, 100);
      
      const pattern = Trianglify({
        width: validWidth,
        height: validHeight,
        cellSize: 75,
        variance: 0.75,
        seed: Math.random().toString(),
        xColors: palette,
        yColors: palette,
        fill: true,
        strokeWidth: 0,
      });

      return pattern.toCanvas().toDataURL();
    };

    const drawToBackground = (bgNum: number) => {
      try {
        const dataUrl = generatePattern(bgNum);
        const targetRef = bgNum === 1 ? bg1Ref : bg2Ref;
        
        if (targetRef.current) {
          targetRef.current.style.backgroundImage = `url(${dataUrl})`;
          
          if (bgNum === 1) {
            targetRef.current.style.opacity = '1';
            if (bg2Ref.current) bg2Ref.current.style.opacity = '0';
          } else {
            targetRef.current.style.opacity = '1';
            if (bg1Ref.current) bg1Ref.current.style.opacity = '0';
          }
        }
      } catch (error) {
        console.error('Failed to generate Trianglify pattern:', error);
        const targetRef = bgNum === 1 ? bg1Ref : bg2Ref;
        if (targetRef.current) {
          targetRef.current.style.backgroundImage = 'linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #FF4500 100%)';
        }
      }
    };

    const initialTimeout = setTimeout(() => {
      drawToBackground(1);
    }, 100);
    
    const interval = setInterval(() => {
      setCurrentDraw(prev => {
        const next = prev === 1 ? 2 : 1;
        drawToBackground(next);
        return next;
      });
    }, 5000);

    const handleResize = () => {
      const newWidth = Math.max(window.innerWidth || 1920, 100);
      const newHeight = Math.max(window.innerHeight || 1080, 100);
      
      if (bg1Ref.current) {
        bg1Ref.current.style.minWidth = `${newWidth}px`;
        bg1Ref.current.style.minHeight = `${newHeight}px`;
      }
      if (bg2Ref.current) {
        bg2Ref.current.style.minWidth = `${newWidth}px`;
        bg2Ref.current.style.minHeight = `${newHeight}px`;
      }
      
      setTimeout(() => {
        drawToBackground(1);
        drawToBackground(2);
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="selector-container">
      <style>{`
        .selector-container {
          position: fixed;
          inset: 0;
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .background-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .background-1,
        .background-2 {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: opacity 3000ms ease-in-out;
        }

        .background-1 {
          opacity: 1;
          z-index: 1;
        }

        .background-2 {
          opacity: 0;
          z-index: 0;
        }

        .selector-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
          pointer-events: none;
        }

        .selector-content > * {
          pointer-events: auto;
        }

        .selector-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
          z-index: 5;
          pointer-events: none;
        }
      `}</style>

      <div className="background-container">
        <div ref={bg1Ref} className="background-1" />
        <div ref={bg2Ref} className="background-2" />
      </div>

      <div className="selector-overlay" />

      <div className="selector-content flex flex-col items-center gap-8 px-4">
        <div className="text-center space-y-3 mb-6">
          <div className="text-sm tracking-widest text-white/80 uppercase">
            Bank Credit Analysis System
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-red-100 to-orange-100 bg-clip-text text-transparent drop-shadow-2xl">
            Business Credit
          </h1>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
            Evaluation
          </h1>
        </div>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl text-center leading-relaxed drop-shadow-lg">
          Y&M Consulting Inc. - AI-powered credit analysis<br />
          Make informed lending decisions with comprehensive financial insights.
        </p>
        
        {/* Simulate Business Selection */}
        <Card className="mt-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-white/20 shadow-2xl max-w-md w-full">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-8 w-8 text-red-600" />
              <div className="text-left">
                <h3 className="text-black dark:text-white">Simulated Business</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">TechStart Solutions Inc.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-left py-4 border-t border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Industry</p>
                <p className="text-sm text-black dark:text-white">Technology</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Est. Revenue</p>
                <p className="text-sm text-black dark:text-white">$2.4M/year</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Employees</p>
                <p className="text-sm text-black dark:text-white">18</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Credit Request</p>
                <p className="text-sm text-black dark:text-white">$500K</p>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full text-lg py-6 bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-orange-600 hover:via-rose-600 hover:to-red-600 transition-all duration-500 shadow-xl hover:shadow-red-500/50 hover:scale-105 border-0"
              onClick={onSelectBusiness}
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Analyze Business
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
