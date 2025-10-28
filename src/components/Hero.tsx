import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LogIn, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { StarsBackground } from './StarsBackground';
import { Footer } from './Footer';

interface HeroProps {
  onLogin: (username: string, password: string) => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

export function Hero({ onLogin }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate credentials
    const validCredentials = [
      { user: 'Business1', pass: '12345' },
      { user: 'Banorte', pass: '67890' },
      { user: 'Business3', pass: '45678' }
    ];
    
    const isValid = validCredentials.some(
      cred => cred.user === username && cred.pass === password
    );
    
    if (isValid) {
      onLogin(username, password);
    } else {
      toast.error('Invalid Credentials', {
        description: 'Please check your username and password.',
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container (60% of viewport height)
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle colors
    const particleColors = ['#000000', '#9b2323', '#000000', '#ff0000'];

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const minSize = Math.max(canvas.height * 3, 2400); // Triple the container height
      for (let i = 0; i < 10; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: minSize + Math.random() * 1800, // MASSIVE circles (2400-4200px)
          speedX: 0.1 + Math.random() * 0.4, // Slow movement
          speedY: 0.1 + Math.random() * 0.4,
          color: particleColors[Math.floor(Math.random() * particleColors.length)]
        });
      }
    };
    initParticles();

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x > canvas.width + particle.size / 2) {
          particle.x = -particle.size / 2;
        }
        if (particle.y > canvas.height + particle.size / 2) {
          particle.y = -particle.size / 2;
        }
        if (particle.x < -particle.size / 2) {
          particle.x = canvas.width + particle.size / 2;
        }
        if (particle.y < -particle.size / 2) {
          particle.y = canvas.height + particle.size / 2;
        }

        // Draw solid circle with more transparency (not blurry)
        ctx.fillStyle = particle.color + '26'; // More transparent (15% opacity)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Top 60% Rectangle with Skew - Red Background with Moving Circles */}
      <div className="relative w-full" style={{ height: '60vh', minHeight: '600px' }}>
        {/* Red Background */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundColor: '#b10505',
            transform: 'skewY(-2.3deg)',
            transformOrigin: 'top left',
          }}
        >
          {/* Canvas for Moving Circles */}
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{
              transform: 'skewY(2.3deg)', // Counter-skew to keep circles normal
              transformOrigin: 'top left',
            }}
          />
        </div>

        {/* Content on top of background */}
        <div 
          className="relative z-10 h-full flex items-center justify-center px-6"
          style={{
            transform: 'skewY(-2.3deg)',
            transformOrigin: 'top left',
          }}
        >
          <div className="max-w-7xl mx-auto w-full" style={{ transform: 'skewY(2.3deg)' }}>
            {/* Company Branding - Centered */}
            <div className="text-center text-white">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold leading-tight mb-8">
                Y&M Consulting Inc.
              </h1>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl text-white/95 leading-tight">
                Smart Credit Decisions
                <br />
                <span className="bg-gradient-to-r from-orange-200 via-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Business Description Section - Light Gray Background with Stars */}
      <div className="relative py-20 overflow-hidden" style={{ backgroundColor: '#f8f8f8' }}>
        {/* Animated Stars Background */}
        <StarsBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Company Information */}
            <div className="space-y-6">
              <div className="mb-8 text-left">
                <h3 className="text-5xl text-gray-900 mb-6 tracking-tight">
                  Empowering Financial Institutions
                </h3>
                <p className="text-2xl text-gray-700 leading-relaxed">
                  Y&M Consulting Inc. provides <span className="font-semibold">cutting-edge credit analysis solutions</span> that help banks and financial institutions make informed lending decisions with confidence and efficiency.
                </p>
              </div>

              {/* Detailed Information Cards - 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Our Mission Card */}
                <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center flex-shrink-0 mb-4">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-between leading-normal flex-grow">
                    <h4 className="mb-3 text-2xl tracking-tight text-gray-900">
                      Our Mission
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">
                      To <span className="font-semibold">revolutionize credit analysis</span> by providing intelligent, data-driven solutions that empower financial institutions to make confident lending decisions.
                    </p>
                  </div>
                </div>

                {/* Our Vision Card */}
                <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mb-4">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-between leading-normal flex-grow">
                    <h4 className="mb-3 text-2xl tracking-tight text-gray-900">
                      Our Vision
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">
                      To become the <span className="font-semibold">leading AI-powered credit analysis platform</span> trusted by banks and businesses worldwide, creating a transparent lending ecosystem.
                    </p>
                  </div>
                </div>

                {/* What We Do Card */}
                <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-orange-600 to-yellow-600 flex items-center justify-center flex-shrink-0 mb-4">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-between leading-normal flex-grow">
                    <h4 className="mb-3 text-2xl tracking-tight text-gray-900">
                      What We Do
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">
                      We combine <span className="font-semibold">advanced analytics, machine learning, and deep financial expertise</span> to deliver comprehensive credit evaluations for lenders and borrowers.
                    </p>
                  </div>
                </div>

                {/* About Us Card */}
                <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center flex-shrink-0 mb-4">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-between leading-normal flex-grow">
                    <h4 className="mb-3 text-2xl tracking-tight text-gray-900">
                      About Us
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">
                      Founded by <span className="font-semibold">financial technology experts</span>, Y&M Consulting Inc. serves banks, credit unions, and small businesses across Mexico with powerful risk assessment tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login Form (Centered) */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-lg">
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-12">
                  <h3 className="text-5xl text-gray-900 mb-10 text-center tracking-tight">
                    Sign In
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="space-y-3">
                      <Label htmlFor="username" className="text-xl text-gray-700">
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                        className="bg-white text-xl py-7"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="password" className="text-xl text-gray-700">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="bg-white text-xl py-7"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-red-700 hover:bg-red-800 text-white py-8 text-2xl shadow-lg transition-all duration-300 mt-10"
                    >
                      <LogIn className="mr-3 h-7 w-7" />
                      Sign In
                    </Button>
                  </form>
                  
                  <div className="mt-10 p-6 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex items-start gap-3 text-blue-800">
                      <AlertCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-lg mb-2">Demo Credentials:</p>
                        <p className="text-lg mt-1">Business (Good): <span className="font-mono font-semibold">Business1 / 12345</span></p>
                        <p className="text-lg">Business (Bad): <span className="font-mono font-semibold">Business3 / 45678</span></p>
                        <p className="text-lg">Bank: <span className="font-mono font-semibold">Banorte / 67890</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
