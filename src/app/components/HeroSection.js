'use client'
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

const DiagonalHeroSection = () => {
  const [videoError, setVideoError] = useState(false);
  const [mainVideoError, setMainVideoError] = useState(false);
  const backgroundVideoRef = useRef(null);
  const mainVideoRef = useRef(null);

  useEffect(() => {
    const playVideos = async () => {
      try {
        if (backgroundVideoRef.current) {
          await backgroundVideoRef.current.play();
        }
        
        // Small delay for main video
        setTimeout(async () => {
          if (mainVideoRef.current && !mainVideoError) {
            try {
              await mainVideoRef.current.play();
            } catch (error) {
              console.log('Main video autoplay prevented, but video is loaded');
            }
          }
        }, 200);
      } catch (error) {
        console.log('Video autoplay prevented:', error);
      }
    };

    playVideos();
  }, [mainVideoError]);

  return (
    <div className="relative h-[710px] bg-white w-full overflow-hidden">
      {/* Animation Video Background Layer */}
      <div className="absolute top-0 left-0 w-full h-[480px] md:h-[600px] xl:h-[600px] lg:h-[600px] z-0 overflow-hidden">
        {!videoError ? (
          <video
            ref={backgroundVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-fill"
            onError={() => setVideoError(true)}
          >
            <source src="/videos/animation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <p className="text-gray-500">Loading animation...</p>
          </div>
        )}

        <div className="absolute inset-0 bg-white/5"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex pt-35 pb-10 lg:pt-20 xl:pt-20 md:pt-20 items-start lg:items-start xl:items-start md:items-center justify-center">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Section */}
            <div className="space-y-4 md:text-left lg:text-left pt-0 lg:pt-20 md:pt-10">
              <h1 className="text-[40px] text-gray-900 sm:text-6xl md:text-5xl lg:text-3xl xl:text-[50px] font-extrabold lg:text-gray-900 md:text-gray-900 drop-shadow-lg leading-tight max-w-full xl:max-w-[100%]">
                Online Credit & Debit Card Fraud Prevention Intelligence System Designed to Grow Your Revenue
              </h1>
              
              <p className="lg:text-[16px] text-black sm:text-lg md:text-xl lg:text-gray-900 leading-relaxed drop-shadow-md max-w-full sm:max-w-2xl lg:max-w-lg lg:mx-0">
                Thousands of businesses trust CardNest Security Scan to secure transactions, prevent online fraud, and protect revenue—helping them build safer, smarter, and more profitable operations.
              </p>
              
              <div className="flex flex-row gap-4 lg:justify-start">
                <Link href="/signup" className="lg:block md:block group relative px-6 sm:px-8 py-1 flex items-center bg-slate-900 text-white font-semibold rounded-full hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base">
                  <span className="relative z-10">Start now  {" >"}</span>
                </Link>
              </div>
            </div>

            {/* Right Content Section - Only Main Video */}
            <div className="space-y-8 hidden lg:flex lg:justify-center lg:items-center mt-8 lg:mt-0">
              <div className="relative">
                {/* Main hero video - Clean and prominent */}
                {!mainVideoError ? (
                  <video 
                    ref={mainVideoRef}
                    width="200"
                    height="auto"
                    className="object-contain rounded-xl shadow-2xl border border-gray-200"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onError={(e) => {
                      console.error('Main video error:', e.target.error);
                      setMainVideoError(true);
                    }}
                    onCanPlay={() => console.log('Main video ready to play')}
                    onLoadedData={() => console.log('Main video loaded successfully')}
                  >
                    <source src="/videos/main_video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  /* Clean fallback */
                  <div 
                    className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-2xl flex items-center justify-center border border-gray-200"
                    style={{ width: '300px', height: '300px' }}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l7-5z"/>
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">CardNest Demo</p>
                      <p className="text-xs text-gray-500 mt-1">Loading video...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagonalHeroSection;