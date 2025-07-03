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
        <div className="w-full">
          <div className="flex items-center">
            
            {/* Left Content Section - Fixed width allocation */}
            <div className="w-full lg:w-[55%] xl:w-[50%] px-4 sm:px-6 lg:px-8 flex items-center justify-center pt-0 lg:pt-20 md:pt-10">
              <div className="w-full lg:w-[70%] md:w-[80%] xl:w-[84%]  space-y-4 ">
                <h1 className="text-[39px] text-gray-900 sm:text-6xl md:text-5xl lg:text-[35px] xl:text-[48px] font-extrabold lg:text-gray-900 md:text-gray-900 drop-shadow-lg leading-tight">
                  Online Credit & Debit Card Fraud Prevention Intelligence System Designed to Grow Your Revenue
                </h1>
                
                <p className="lg:text-[16px] text-black sm:text-lg md:text-xl lg:text-gray-900 leading-relaxed drop-shadow-md">
                  Thousands of businesses trust CardNest Security Scan to secure transactions, prevent online fraud, and protect revenue—helping them build safer, smarter, and more profitable operations.
                </p>
                
                <div className="flex flex-row gap-4 justify-start">
                  <Link href="/signup" className="lg:block md:block group relative px-6 sm:px-8 py-1 flex items-center bg-slate-900 text-white font-semibold rounded-full hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base">
                    <span className="relative z-10">Start now  {" >"}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Content Section - Video and Image extending to screen edge */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] items-center h-full pt-20">
              <div className="flex items-center gap-[5px] h-[350px] w-full">
                {/* Video on the left */}
                <div className="flex-shrink-0">
                  {!mainVideoError ? (
                    <video 
                      ref={mainVideoRef}
                      className="h-[350px] w-auto object-contain rounded-xl shadow-2xl border border-gray-200"
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
                      <source src="https://d2s949xdj8dp2l.cloudfront.net/CardNest%20Ads%20Main%20Mobile%20iPhone%20version.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="h-[350px] w-[200px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-2xl flex items-center justify-center border border-gray-200">
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

                {/* Image extending to the right edge of screen */}
                <div className="flex-1 h-[350px] rounded-l-xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: 'url(/images/image.png)',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default DiagonalHeroSection;