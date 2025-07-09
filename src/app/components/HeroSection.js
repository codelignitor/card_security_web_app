// 'use client'
// import Link from 'next/link';
// import React, { useState, useRef, useEffect } from 'react';

// const DiagonalHeroSection = () => {
//   const [videoError, setVideoError] = useState(false);
//   const [mainVideoError, setMainVideoError] = useState(false);
//   const backgroundVideoRef = useRef(null);
//   const mainVideoRef = useRef(null);

//   useEffect(() => {
//     const playVideos = async () => {
//       try {
//         if (backgroundVideoRef.current) {
//           await backgroundVideoRef.current.play();
//         }
        
//         // Small delay for main video
//         setTimeout(async () => {
//           if (mainVideoRef.current && !mainVideoError) {
//             try {
//               await mainVideoRef.current.play();
//             } catch (error) {
//               console.log('Main video autoplay prevented, but video is loaded');
//             }
//           }
//         }, 200);
//       } catch (error) {
//         console.log('Video autoplay prevented:', error);
//       }
//     };

//     playVideos();
//   }, [mainVideoError]);

//   return (
//     <div className="relative h-[660px] bg-white w-full overflow-hidden">
//       {/* Animation Video Background Layer */}
//       <div className="absolute top-0 left-0 w-full h-[480px] md:h-[600px] xl:h-[600px] lg:h-[600px] z-0 overflow-hidden">
//         {!videoError ? (
//           <video
//             ref={backgroundVideoRef}
//             autoPlay
//             loop
//             muted
//             playsInline
//             preload="metadata"
//             className="w-full h-full object-fill"
//             onError={() => setVideoError(true)}
//           >
//             <source src="/videos/animation.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
//             <p className="text-gray-500">Loading animation...</p>
//           </div>
//         )}

//         <div className="absolute inset-0 bg-white/5"></div>
//       </div>

//       {/* Content Container */}
//       <div className="relative z-10 flex pt-25 pb-10 lg:pt-20 xl:pt-20 md:pt-20 items-start lg:items-start xl:items-start md:items-center justify-center">
//         <div className="container mx-auto lg:max-w-6xl">
//           <div className="flex mx-auto  items-start lg:items-start xl:items-start">
            
//             {/* Left Content Section - Aligned with navbar logo */}
//             <div className="w-full lg:w-[55%] xl:w-[50%] px-4 sm:px-6 lg:px-4 flex items-start justify-start pt-0 lg:pt-20 md:pt-10">
//               <div className="w-full space-y-7">
//                 <h1 className="text-gray-900 font-extrabold lg:text-gray-900 md:text-gray-900 drop-shadow-lg leading-tight">
//                   <div className="text-[38px] sm:text-[40px] md:text-[40px] lg:text-[38px] xl:text-[45px] 2xl:text-[55px] sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">
//                     Online Credit & Debit Card
//                   </div>
//                   <div className="text-[38px] sm:text-[40px] md:text-[40px] lg:text-[34px] xl:text-[45px] 2xl:text-[53px] sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">
//                     Fraud Prevention Intelligence
//                   </div>
//                   <div className="text-[38px] sm:text-[40px] md:text-[40px] lg:text-[38px] xl:text-[45px] 2xl:text-[55px] sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">
//                     System Designed to Grow
//                   </div>
//                   <div className="text-[38px] sm:text-[40px] md:text-[40px] lg:text-[38px] xl:text-[45px] 2xl:text-[55px] sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">
//                     Your Revenue
//                   </div>
//                 </h1>
                
//                 <p className="lg:text-[16px] text-black sm:text-lg md:text-xl lg:text-gray-900 leading-relaxed drop-shadow-md">
//                   Thousands of businesses trust CardNest Security Scan to secure transactions, prevent online fraud, and protect revenue—helping them build safer, smarter, and more profitable operations.
//                 </p>
                
//                 <div className="flex flex-row gap-4 justify-start">
//                   <Link href="/signup" className="lg:block md:block group relative px-6 sm:px-8 py-1 flex items-center bg-slate-900 text-white font-semibold rounded-full hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base">
//                     <span className="relative z-10">Start now  {" >"}</span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Content Section - Starting from the right edge of screen */}
//         <div className="hidden lg:block lg:absolute lg:right-0 lg:top-20 xl:top-20 lg:w-[50vw] xl:w-[45vw] h-full pt-20">
//           <div className="flex items-center justify-between h-[350px] w-full  pr-[10px]">
//             {/* Image positioned at the very right with 10px margin */}
//             <div className="absolute right-[10px] h-[350px] w-[300px] xl:w-[350px]">
//               <div className="w-full h-full rounded-l-xl shadow-2xl border border-gray-200 overflow-hidden">
//                 <div 
//                   className="w-full h-full bg-cover bg-center bg-no-repeat"
//                   style={{
//                     backgroundImage: 'url(/images/image.png)',
//                   }}
//                 ></div>
//               </div>
//             </div>

//             {/* Video positioned to the left of the image */}
//             <div className="absolute right-[320px] xl:right-[370px] flex-shrink-0 z-20">
//               {!mainVideoError ? (
//                 <video 
//                   ref={mainVideoRef}
//                   className="h-[350px] w-auto object-contain rounded-xl shadow-2xl border border-gray-200"
//                   autoPlay
//                   loop
//                   muted
//                   playsInline
//                   preload="auto"
//                   onError={(e) => {
//                     console.error('Main video error:', e.target.error);
//                     setMainVideoError(true);
//                   }}
//                   onCanPlay={() => console.log('Main video ready to play')}
//                   onLoadedData={() => console.log('Main video loaded successfully')}
//                 >
//                   <source src="https://d2s949xdj8dp2l.cloudfront.net/CardNest%20Ads%20Main%20Mobile%20iPhone%20version.mp4" type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <div className="h-[350px] w-[200px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-2xl flex items-center justify-center border border-gray-200">
//                   <div className="text-center">
//                     <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
//                       <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M8 5v10l7-5z"/>
//                       </svg>
//                     </div>
//                     <p className="text-sm text-gray-600 font-medium">CardNest Demo</p>
//                     <p className="text-xs text-gray-500 mt-1">Loading video...</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiagonalHeroSection;



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
    <div className="relative h-[660px] bg-white w-full overflow-hidden">
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

      {/* Content Container - Centered */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start justify-start gap-8 lg:gap-12">
            
            {/* Left Content Section - Centered */}
            <div className="w-full lg:w-[60%] text-start pt-20 lg:pt-2 lg:text-left flex flex-col items-center lg:items-start">
              <div className="space-y-7 max-w-2xl">
                <h1 className="text-gray-900 font-extrabold drop-shadow-lg leading-tight">
                  <div className="text-[38px] sm:text-[40px] md:text-[45px] lg:text-[40px] xl:text-[48px] 2xl:text-[45px]">
                    Online Credit & Debit Card
                  </div>
                  <div className="text-[38px] sm:text-[40px] md:text-[45px] lg:text-[40px] xl:text-[45px] 2xl:text-[45px]">
                    Fraud Prevention Intelligence
                  </div>
                  <div className="text-[38px] sm:text-[40px] md:text-[45px] lg:text-[40px] xl:text-[48px] 2xl:text-[45px]">
                    System Designed to Grow
                  </div>
                  <div className="text-[38px] sm:text-[40px] md:text-[45px] lg:text-[40px] xl:text-[45px] 2xl:text-[45px]">
                    Your Revenue
                  </div>
                </h1>
                
                <p className="lg:text-[16px] w-[90%] text-black sm:text-lg md:text-xl lg:text-gray-900 leading-relaxed drop-shadow-md">
                  Thousands of businesses trust CardNest Security Scan to secure transactions, prevent online fraud, and protect revenue—helping them build safer, smarter, and more profitable operations.
                </p>
                
                <div className="flex  lg:justify-start">
                  <Link href="/signup" className="group relative px-6 sm:px-8 py-1 flex items-center bg-slate-900 text-white font-semibold rounded-full hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base">
                    <span className="relative z-10">Start now  {" >"}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Content Section - With Expanded Image */}
            <div className="w-full hidden lg:block lg:w-[40%] relative">
              <div className="relative flex  gap-4">
                {/* Video positioned to the left */}
                <div className="flex-shrink-0 z-20">
                  {!mainVideoError ? (
                    <video 
                      ref={mainVideoRef}
                      className="h-[300px] sm:h-[350px] w-auto object-contain rounded-xl shadow-2xl border border-gray-200"
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
                    <div className="h-[300px] sm:h-[350px] w-[200px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-2xl flex items-center justify-center border border-gray-200">
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

                {/* Image positioned to the right - Now expands beyond container */}
                <div className="absolute -right-20 lg:-right-25 xl:-right-20 2xl:-right-30 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="h-[300px] sm:h-[350px] w-[300px] sm:w-[350px] xl:w-[400px] 2xl:w-[450px]">
                    <div className="w-full h-full rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
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
      </div>
    </div>
  );
};

export default DiagonalHeroSection;