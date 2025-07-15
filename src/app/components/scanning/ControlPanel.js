import React from 'react';
import DetectionResults from './DetectionResults';

const ControlPanel = ({
  currentPhase,
  onStartValidation,
  onStartFrontScan,
  onStartBackScan,
  onStop,
  onReset,
  onTryAgain,
  onStartOver,
  validationState,
  frontScanState,
  countdown,
  errorMessage,
  finalOcrResults,
  detectionActive,
  isProcessing,
  attemptCount,
  maxAttempts,
  maxAttemptsReached,

}) => {
  const isActive = detectionActive || isProcessing || countdown > 0;
  const isLastAttempt = attemptCount === maxAttempts - 1;

  // Show results if detection is complete
  if (currentPhase === 'results') {
    return (
      <DetectionResults 
        finalOcrResults={finalOcrResults} 
        onReset={onReset} 
      />
    );
  }

  // Show error state with try again options
  if (currentPhase === 'error') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="text-center mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Security Scan Detection Failed.</h3>
            <p className="text-red-700 mb-3">Please ensure the card is in a clear view.</p>
            
            {attemptCount < maxAttempts && (
              <div className="text-sm text-red-600">
                You have {maxAttempts - attemptCount} attempt{maxAttempts - attemptCount !== 1 ? 's' : ''} remaining.
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!maxAttemptsReached && (
              <button
                onClick={onTryAgain}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            )}
          </div>

          {/* Show alternative payment methods when only one attempt left */}
          {isLastAttempt && (
         <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <p className="text-sm text-blue-800 mb-4 font-medium">
    Alternative Payment Options:
  </p>
  <div className="flex flex-wrap justify-center items-center gap-4">
    {/* Google Pay */}
    <div className="flex items-center bg-white rounded-xl p-3 px-4 shadow-md border hover:shadow-lg transition">
      <svg width="36" height="20" viewBox="0 0 48 20" fill="none" className="shrink-0">
        <path d="M19.7 10c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm-7.5 0c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5z" fill="#4285F4"/>
        <path d="M27.2 7.5h-4.8V5h4.8c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5z" fill="#34A853"/>
        <path d="M27.2 12.5h-4.8V10h4.8c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5z" fill="#FBBC04"/>
        <path d="M22.4 15h4.8c1.4 0 2.5-1.1 2.5-2.5v-5c0-1.4-1.1-2.5-2.5-2.5h-4.8v10z" fill="#EA4335"/>
      </svg>
      <span className="ml-3 text-base font-semibold text-gray-800">Google Pay</span>
    </div>

    {/* Apple Pay */}
    <div className="flex items-center bg-white rounded-xl p-3 px-4 shadow-md border hover:shadow-lg transition">
      <svg width="36" height="20" viewBox="0 0 48 20" fill="none" className="shrink-0">
        <path d="M11.5 1c-1.1 0-2.1.4-2.8 1.1-.7.7-1.1 1.7-1.1 2.8 0 .2 0 .4.1.6 1.2-.1 2.4-.6 3.2-1.4.8-.8 1.2-1.9 1.2-3-.4-.1-.4-.1-.6-.1zm1.3 3.2c-1.7 0-3.1.9-3.9.9s-2.2-.9-3.7-.9c-1.9 0-3.6 1.1-4.6 2.8-1.9 3.4-.5 8.4 1.4 11.2.9 1.4 2 2.9 3.4 2.9s1.9-.9 3.5-.9 2.1.9 3.5.9 2.4-1.4 3.3-2.8c1.1-1.6 1.5-3.2 1.5-3.3 0-.1-2.9-1.1-2.9-4.4 0-2.8 2.3-4.1 2.4-4.2-1.3-1.9-3.3-2.1-4-2.2z" fill="#000"/>
      </svg>
      <span className="ml-3 text-base font-semibold text-gray-800">Apple Pay</span>
    </div>
  </div>
</div>

          )}
        </div>
      </div>
    );
  }

  // Show max attempts reached state
  if (currentPhase === 'max-attempts-reached') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Currently, you have reached the maximum number of times you can scan. </h3>
            <p className="text-red-700 mb-3 font-bold">Contact customer support for assistance or retry the scanning process. </p>
          </div>
        </div>
      </div>
    );
  }

  // Regular control panel for active phases
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        
        {/* Start Validation Button */}
        {currentPhase === 'idle' && (
          <button
            onClick={onStartValidation}
            disabled={isActive || maxAttemptsReached}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg  transition-colors w-full sm:w-auto"
          >
            {isActive ? 'Validating...' : 'Start Scanning'}
          </button>
        )}

        {/* Start Front Scan Button */}
        {currentPhase === 'ready-for-front' && (
          <button
            onClick={onStartFrontScan}
            disabled={isActive || maxAttemptsReached}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            {isActive ? 'Scanning Front...' : 'Scan Front Side'}
          </button>
        )}

        {/* Start Back Scan Button */}
        {currentPhase === 'ready-for-back' && (
          <button
            onClick={onStartBackScan}
            disabled={isActive || maxAttemptsReached || !frontScanState.canProceedToBack}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            {isActive ? 'Scanning Back...' : 'Scan Back Side'}
          </button>
        )}
      </div>

      {/* Control Buttons Row - Only show Stop button */}
      {currentPhase !== 'idle' && currentPhase !== 'ready-for-front' && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4">
          {/* Stop Button - enabled during active detection */}
          <button
            onClick={onStop}
            disabled={!isActive || maxAttemptsReached}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            {isActive ? 'Stop Detection' : 'Stop Detection'}
          </button>
        </div>
      )}

      {/* Status Messages Section - Always present to prevent UI jumping */}
      <div className="mt-4 text-center min-h-[60px] flex items-center justify-center">
        {countdown > 0 && (
          <p className="text-lg font-semibold text-blue-600">
            Starting in {countdown}...
          </p>
        )}

        {isProcessing && !countdown && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-600 font-medium">Processing frame...</p>
          </div>
        )}

        {/* Success Messages */}
        {!isProcessing && !countdown && currentPhase === 'ready-for-front' && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <p className="text-green-600 text-lg">Card validation successful!</p>
          </div>
        )}

        {!isProcessing && !countdown && currentPhase === 'ready-for-back' && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <p className="text-green-600 text-lg">Front side detected successfully!</p>
          </div>
        )}

        {/* Default placeholder for consistent height */}
        {!isProcessing && !countdown && 
         currentPhase !== 'idle' && 
         currentPhase !== 'ready-for-front' && 
         currentPhase !== 'ready-for-back' && (
          <div className="text-transparent select-none">
            {/* Invisible placeholder to maintain height */}
            Processing frame...
          </div>
        )}
      </div>

      {/* Show alternative payment methods when only one attempt left during validation */}
      {currentPhase === 'idle' && isLastAttempt && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-3 font-medium text-center">
            Or try payment with:
          </p>
          <div className="flex justify-center items-center gap-4">
            {/* Google Pay Logo */}
            <div className="flex items-center justify-center bg-white rounded-lg p-3 shadow-sm border">
              <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                <path d="M19.7 10c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5zm-7.5 0c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5z" fill="#4285F4"/>
                <path d="M27.2 7.5h-4.8V5h4.8c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5z" fill="#34A853"/>
                <path d="M27.2 12.5h-4.8V10h4.8c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5z" fill="#FBBC04"/>
                <path d="M22.4 15h4.8c1.4 0 2.5-1.1 2.5-2.5v-5c0-1.4-1.1-2.5-2.5-2.5h-4.8v10z" fill="#EA4335"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700">Google Pay</span>
            </div>

            {/* Apple Pay Logo */}
            <div className="flex items-center justify-center bg-white rounded-lg p-3 shadow-sm border">
              <svg width="48" height="20" viewBox="0 0 48 20" fill="none">
                <path d="M11.5 1c-1.1 0-2.1.4-2.8 1.1-.7.7-1.1 1.7-1.1 2.8 0 .2 0 .4.1.6 1.2-.1 2.4-.6 3.2-1.4.8-.8 1.2-1.9 1.2-3-.4-.1-.4-.1-.6-.1zm1.3 3.2c-1.7 0-3.1.9-3.9.9s-2.2-.9-3.7-.9c-1.9 0-3.6 1.1-4.6 2.8-1.9 3.4-.5 8.4 1.4 11.2.9 1.4 2 2.9 3.4 2.9s1.9-.9 3.5-.9 2.1.9 3.5.9 2.4-1.4 3.3-2.8c1.1-1.6 1.5-3.2 1.5-3.3 0-.1-2.9-1.1-2.9-4.4 0-2.8 2.3-4.1 2.4-4.2-1.3-1.9-3.3-2.1-4-2.2z" fill="#000"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700">Apple Pay</span>
            </div>
          </div>
        </div>
      )}

      {/* Requirements not met warning */}
      {currentPhase === 'ready-for-back' && !frontScanState.canProceedToBack && (
        <div className="mt-4 text-center">
          <p className="text-sm text-orange-600">
            Front side scan incomplete. Both chip and bank logo must be detected.
          </p>
        </div>
      )}

      {/* Attempt Counter */}
      {attemptCount > 0 && !maxAttemptsReached && (
        <div className="mt-4 text-center">
          <p className="text-sm text-orange-600">
            Attempts: {attemptCount}/{maxAttempts}
          </p>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;