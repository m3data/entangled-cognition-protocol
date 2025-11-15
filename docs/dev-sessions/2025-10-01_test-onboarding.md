# Onboarding System Test Checklist

## Module Loading Tests

Open http://localhost:3141/test-modules.html and verify:

- [  ] All 5 modules load without errors
- [  ] All classes instantiate successfully
- [  ] No console errors

## Onboarding Flow Tests

Open http://localhost:3141/onboarding.html and test:

### Phase 1: Entry
- [  ] Page loads without errors
- [  ] "Begin Breathing Guide" button is visible
- [  ] Clicking breathing button activates breathing circle
- [  ] Breathing guide shows 8-5-11 pattern (inhale-hold-exhale)
- [  ] After 3 breath cycles, "Continue" button becomes enabled
- [  ] Progress bar shows "Entry" as active

### Phase 2: Attunement  
- [  ] Page transitions to Attunement phase
- [  ] 3 principle cards visible (Participatory, Entanglement, Ritual)
- [  ] Clicking "Explore This" on a card expands details
- [  ] Micro-experiment renders in expanded card
- [  ] Path selection cards appear (Researcher, Artist, Consciousness, Skeptic)
- [  ] Selecting a path highlights the card
- [  ] Continue button enables after exploring 1+ principle and selecting path
- [  ] Progress bar updates

### Phase 3: Emergence
- [  ] Page transitions to Emergence phase
- [  ] Sacred Space textarea accepts input
- [  ] Intention textarea accepts input
- [  ] Ritual elements checkboxes work
- [  ] Experiment designer shows content based on selected path
- [  ] Ethics consent checkbox appears
- [  ] Continue button enables after filling required fields + consent
- [  ] Progress bar updates

### Phase 4: Return
- [  ] Page transitions to Return phase
- [  ] Completion summary displays user's choices
- [  ] Shows: selected path, sacred space, intention, ritual elements, experiment
- [  ] Closing reflection textarea works
- [  ] "Save My Profile" button visible
- [  ] Progress bar shows complete

### Profile Persistence
- [  ] Click "Save My Profile & Enter the Journal"
- [  ] localStorage contains 'ecpUserProfile' key
- [  ] localStorage contains 'ecpOnboardingCompleted' = 'true'
- [  ] User redirects to appropriate page based on path

### Home Page Integration
Open http://localhost:3141/home.html (or wherever redirected):

- [  ] Page shows personalized welcome (not default)
- [  ] Personalized greeting includes user's path
- [  ] Suggested actions appear based on user choices
- [  ] No onboarding invitation visible (since completed)

## Bug Reports

Document any issues found:

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

## Browser Console Errors

Copy any JavaScript errors here:

```
[paste errors]
```

---

## Test Results Summary

- Total tests: 35
- Passed: ___
- Failed: ___
- Blocked: ___

Critical issues preventing use:
- 
-
-
