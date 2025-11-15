// Paste this in the browser console on the onboarding page when on Emergence phase:

console.log('=== MANUAL DEBUG CHECK ===');
console.log('OnboardingFlow instance:', window.onboardingFlow);
console.log('Current phase:', window.onboardingFlow?.currentPhase);
console.log('User profile:', window.onboardingFlow?.userProfile);
console.log('Sacred space:', window.onboardingFlow?.userProfile.sacredSpace);
console.log('Sacred space length:', window.onboardingFlow?.userProfile.sacredSpace.length);
console.log('Intention:', window.onboardingFlow?.userProfile.intention);
console.log('Intention length:', window.onboardingFlow?.userProfile.intention.length);
console.log('Ethics consent:', window.onboardingFlow?.userProfile.ethicsConsent);
console.log('Manual check:', 
  window.onboardingFlow?.userProfile.ethicsConsent,
  '&&',
  window.onboardingFlow?.userProfile.sacredSpace.length,
  '> 10 &&',
  window.onboardingFlow?.userProfile.intention.length,
  '> 10'
);
