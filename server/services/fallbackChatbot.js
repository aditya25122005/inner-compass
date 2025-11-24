/**
 * Fallback Chatbot - Rule-based responses when Gemini API is unavailable
 * Provides empathetic, context-aware responses for InnerCompass
 */

class FallbackChatbot {
  constructor() {
    this.greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    this.farewells = ['bye', 'goodbye', 'see you', 'take care'];
  }

  generateResponse(userMessage, context = []) {
    const msgLower = userMessage.toLowerCase().trim();
    
    // Greeting responses
    if (this.containsAny(msgLower, this.greetings)) {
      return this.getGreetingResponse();
    }
    
    // Farewell responses
    if (this.containsAny(msgLower, this.farewells)) {
      return this.getFarewellResponse();
    }
    
    // Emotional state detection and responses
    if (this.containsAny(msgLower, ['anxious', 'anxiety', 'worried', 'worry', 'nervous', 'panic'])) {
      return this.getAnxietyResponse(msgLower);
    }
    
    if (this.containsAny(msgLower, ['sad', 'depressed', 'depression', 'down', 'unhappy', 'crying', 'tears'])) {
      return this.getSadnessResponse(msgLower);
    }
    
    if (this.containsAny(msgLower, ['happy', 'joy', 'joyful', 'excited', 'great', 'wonderful', 'amazing', 'fantastic'])) {
      return this.getHappinessResponse(msgLower);
    }
    
    if (this.containsAny(msgLower, ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'furious'])) {
      return this.getAngerResponse(msgLower);
    }
    
    if (this.containsAny(msgLower, ['stress', 'stressed', 'overwhelm', 'overwhelmed', 'pressure'])) {
      return this.getStressResponse(msgLower);
    }
    
    if (this.containsAny(msgLower, ['tired', 'exhausted', 'fatigue', 'burnout', 'drained'])) {
      return this.getFatigueResponse(msgLower);
    }
    
    if (this.containsAny(msgLower, ['lonely', 'alone', 'isolated', 'isolation'])) {
      return this.getLonelinessResponse(msgLower);
    }
    
    // Help-seeking
    if (this.containsAny(msgLower, ['help', 'advice', 'suggest', 'what should i do', 'how can i'])) {
      return this.getHelpResponse(msgLower);
    }
    
    // Gratitude
    if (this.containsAny(msgLower, ['thank', 'thanks', 'appreciate', 'grateful'])) {
      return this.getGratitudeResponse();
    }
    
    // Sleep issues
    if (this.containsAny(msgLower, ['sleep', 'insomnia', "can't sleep", "tired but can't sleep"])) {
      return this.getSleepResponse(msgLower);
    }
    
    // Work/School stress
    if (this.containsAny(msgLower, ['work', 'job', 'school', 'study', 'exam', 'deadline'])) {
      return this.getWorkStressResponse(msgLower);
    }
    
    // Relationship issues
    if (this.containsAny(msgLower, ['relationship', 'friend', 'family', 'partner', 'argument', 'fight'])) {
      return this.getRelationshipResponse(msgLower);
    }
    
    // Default empathetic response
    return this.getDefaultResponse(msgLower);
  }

  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  getGreetingResponse() {
    const responses = [
      "Yo! What's good? 😎 How you been?",
      "Hey dude! What's up? Ready to chat? 🤙",
      "Heyyy! Good vibes only here! What's happening with you? ✨",
      "Sup! I'm vibing and ready to listen. What's on your mind? 🌟"
    ];
    return this.randomChoice(responses);
  }

  getFarewellResponse() {
    const responses = [
      "Catch you later! You're awesome, don't forget it! 💜🔥",
      "Peace out! Hit me up anytime you need me. You got this, champ! 🌟",
      "Later dude! Be good to yourself, yeah? I'm here 24/7! 😎✨",
      "Ayy, take care! Remember - you're a legend! Come back soon! 🚀💫"
    ];
    return this.randomChoice(responses);
  }

  getAnxietyResponse(msg) {
    const responses = [
      "Yo, anxiety can be brutal fr 😔 But we got this! Try the 4-4-4 breathing real quick - in for 4, hold 4, out 4. Also splash some cold water on your face - trust me, it's like hitting a reset button! What's got you stressed, fam?",
      "Dang, anxiety hitting hard rn. That's rough, dude. Here's a sick trick: Do the 5-4-3-2-1 thing - name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste. Sounds weird but it WORKS! Wanna talk about what's up?",
      "Anxiety be doing too much sometimes, I feel you! Pro move: Write that stuff down - get it outta your head onto paper. Also get up and move around - even just for 5 mins. Your body needs it! What's going on?",
      "I see you're anxious rn. Let's fix that! Put your hand on your belly and take some deep breaths - feel your hand move. This literally calms your nervous system down! And hey, this feeling is temporary - you're gonna be okay. What's on your mind, bro?"
    ];
    return this.randomChoice(responses);
  }

  getSadnessResponse(msg) {
    const responses = [
      "Aww man, I'm sorry you're feeling down 💙 It's totally valid tho. Here's what helps: Put on something funny that makes you laugh, or blast your fave feel-good playlist! Even a quick 10-min walk can change your whole vibe. What's got you feeling this way, dude?",
      "That's rough, I feel for you fr 😔 I'm here tho! Real talk - have you eaten today? Being hangry makes everything worse lol. Also maybe hit up a friend? Sometimes we need our people. What's been happening?",
      "Dude, I hear you and I'm sorry you're going through it. Takes real strength to be honest about this stuff! Do one thing you love today - binge a show, take a bath, eat your comfort food. Small wins count! Wanna share what's up?",
      "Sending massive hugs your way 🤗💙 Sadness hits different, I know. Try journaling - it actually helps get those feels out. And hey, this won't last forever, I promise. I'm here for you - zero judgment, just vibes and support. Talk to me?"
    ];
    return this.randomChoice(responses);
  }

  getHappinessResponse(msg) {
    const responses = [
      "YOOO THAT'S WHAT'S UP! 🎉🔥 Love this energy! What's got you so hyped?",
      "Ayyyy let's gooo! 😊✨ Your happiness is literally contagious rn! Spill the tea - what happened?!",
      "YESSS! That's fire! 🌟💯 These are the vibes we love! What's got you feeling so good, champ?",
      "Brooo that's amazing! 🚀✨ I'm hyped for you! What's been going so well?!"
    ];
    return this.randomChoice(responses);
  }

  getAngerResponse(msg) {
    const responses = [
      "Yo I can tell you're mad frustrated right now. That's valid af! Here's what works: Go for a walk or punch a pillow for real - let that energy out! Physical stuff helps. Wanna vent? I'm all ears, no judgment.",
      "Damn, something really ticked you off huh? It's cool to be angry! Pro move: Count to 10 slow or write an angry text you NEVER send. Gets it all out safely. What's going down? Let it all out dude.",
      "I feel you - you're proper pissed and that's legit. Try this: Walk away for 5-10 mins. Your brain needs to chill before you do anything. Sometimes you just gotta rant it out, you know? What happened bro?",
      "Man that sounds frustrating fr 😤 Anger means something you care about got messed with. Quick fix: Do some intense workout or aggressively clean your room lol - channel that energy! Wanna talk about it?"
    ];
    return this.randomChoice(responses);
  }

  getStressResponse(msg) {
    const responses = [
      "Yooo stress is brutal fr 😓 Here's the move: Write down everything stressing you out. Then pick just ONE thing to deal with. Breaking it up makes it way more doable! What's the main thing stressing you rn?",
      "Dude I feel you - stress be hitting different! Real talk: Take 5-10 mins RIGHT NOW and just... breathe. Do nothing. Also try Pomodoro - 25 mins work, 5 mins break. Have you taken a break today? What's going on?",
      "Man that sounds stressful af! You're juggling too much huh? Here's what's up: Ask yourself 'What NEEDS to be done TODAY?' Everything else? It can wait. Also say no to new stuff. Talk to me - what's been piling up?",
      "Stress is the worst, I'm sorry dude 💆 Real talk: You don't gotta handle it all at once. Pick the most important thing and focus on JUST that. Also move your body - even do jumping jacks for 2 mins! What's the biggest issue?"
    ];
    return this.randomChoice(responses);
  }

  getFatigueResponse(msg) {
    const responses = [
      "Dude you sound EXHAUSTED 😴 Your body's literally screaming! Here's the plan: Take a 20-min power nap (no longer tho!), chug some water (dehydration kills you), and get some sun. You sleeping okay? What's draining your energy?",
      "Bruh being tired makes everything 10x harder fr! Burnout is legit! Listen: Cancel the non-important stuff TODAY. Do bare minimum. Eat something decent. Sleep early. Zero guilt allowed! What's been taking all your juice?",
      "Yo you need a break ASAP! When's the last time you actually rested? For real: Take 15 mins - no phone, no work, NOTHING. Just exist. Also maybe get your iron checked (low iron = dead tired). What's been wearing you down?",
      "That exhausted vibe is your body throwing red flags 🚩 Rest isn't lazy - it's literally necessary! Try this: Do some chill yoga or stretching, cut caffeine after 2pm, and make a solid bedtime routine. What would help you recharge, dude?"
    ];
    return this.randomChoice(responses);
  }

  getLonelinessResponse(msg) {
    const responses = [
      "Aww man, I'm sorry you're feeling lonely 💔 That hits different. Here's what works: Text someone - even just 'hey thinking of you' counts! Join an online community for stuff you're into. Hit up a café or library - being around people helps! Plus I'm here rn! What's up?",
      "Loneliness is rough fr, I get it. Even with people around you can feel alone sometimes. Try this: Volunteer, take a class, or check out local meetups. Putting yourself out there is scary but worth it! I'm here for you tho! Wanna talk?",
      "Dude I wish I could give you a real hug rn 🤗 But you're not alone - I'm here! Pro tips: Call someone (phone call hits different than text), go where people are, or get a pet if you can. Even chatting with a barista helps! What's making you feel isolated?",
      "Man that lonely feeling can hurt so bad. But yo - reaching out like this? That's brave af! Here's the move: Set up regular hangouts with friends, join Discord servers for your hobbies, or try Meetup app. Baby steps! I'm here to chill with you. What's going on?"
    ];
    return this.randomChoice(responses);
  }

  getHelpResponse(msg) {
    const responses = [
      "Yo I got you! What do you need help with? I can drop advice on stress, anxiety, sleep, relationships, or just be here to listen. Let's figure this out together fam 💪",
      "For sure dude! I'm here however you need. Got tips for handling emotions, building better habits, all that good stuff. What's going on? Talk to me!",
      "Ayy I got your back! I can help with anxiety techniques, stress relief, better sleep, work-life balance, all of it. What's up? Tell me what you're dealing with and we'll tackle it together.",
      "Yo I'm here to help! I got coping strategies, wellness tips, and I'm always down to listen. Real talk tho - for serious stuff (like self-harm thoughts), def reach out to a professional or crisis line. What do you need bro?"
    ];
    return this.randomChoice(responses);
  }

  getGratitudeResponse() {
    const responses = [
      "Aww, of course! Anytime, friend! 😊 Anything else on your mind?",
      "No problem at all! That's what I'm here for! 💜",
      "You're welcome! Always happy to chat with you 😊 What else is up?",
      "Hey, no worries! I'm glad I could help! Want to talk about anything else?"
    ];
    return this.randomChoice(responses);
  }

  getSleepResponse(msg) {
    const responses = [
      "Bruh not being able to sleep is THE WORST! 😴 Here's the deal: No screens 1 hour before bed (blue light murders your sleep), keep your room cold (65-68°F is perfect), and try 4-7-8 breathing. What's keeping you awake?",
      "Sleep problems are so annoying fr! Try this: Dim lights at 9pm, hot shower, boring book, chamomile tea. Make it your whole vibe! Also no caffeine after 2pm or you're cooked. What do you think is messing with your sleep?",
      "Can't sleep? That's brutal dude 😞 Your brain won't shut up right? Do this: Brain dump everything on paper before bed - get it ALL out. Also try tensing and relaxing each muscle group. What's up?",
      "Sleep issues make life so much harder! Quick moves: Exercise during the day (not at night tho), don't eat heavy late, try melatonin or magnesium. If it keeps happening def talk to a doc. What's going on at night?"
    ];
    return this.randomChoice(responses);
  }

  getWorkStressResponse(msg) {
    const responses = [
      "Yo work/school stress is TOO REAL! But listen - you're way more than your productivity or grades! Here's the move: Time-block your day, take actual breaks (put the phone away!), and STOP working at a set time. Boundaries are key! What's stressing you most?",
      "Damn, work/school can be overwhelming af 😓 Try Pomodoro: 25 mins work, 5 mins break. Also knock out the hardest thing FIRST when your brain is fresh. You been taking breaks? What's the toughest part rn?",
      "Deadlines are actual torture fr! Here's what works: Break big stuff into tiny pieces, use a planner/app, and ask for help when you're stuck. Also TAKE BREAKS - your brain needs them! What's coming up that's got you stressed?",
      "Dude I feel you on that work/school pressure! It's a lot fr. Real talk: Say no to extra stuff, delegate when you can, and remember - B's get degrees! Done is better than perfect. What's been getting to you?"
    ];
    return this.randomChoice(responses);
  }

  getRelationshipResponse(msg) {
    const responses = [
      "Yo relationship stuff gets messy fr 😕 Here's the tea: Say 'I feel' not 'You always'. Take a breather if you're heated. And actually LISTEN to understand, not just to clap back. What's going on? Wanna talk about it?",
      "Ugh fighting with people you care about SUCKS! Try this: Wait till you're both chill to talk. Be like 'Can we talk about this?' Text if face-to-face is too much. Remember - it's you + them vs. the problem, not vs. each other. What happened dude?",
      "Relationships can be tough ngl. Communication is everything but it's not always easy. Pro tip: Be specific about what you need (no vague stuff), acknowledge their feelings too, and meet in the middle. Takes two people working on it! What's been going on?",
      "Sorry you're dealing with relationship drama 💔 That's draining af. Real talk: Set boundaries, don't expect them to read your mind, own up when you're wrong, and know when to bounce from toxic situations. You deserve respect! What's the situation?"
    ];
    return this.randomChoice(responses);
  }

  getDefaultResponse(msg) {
    const responses = [
      "I'm listening dude! Tell me more - what's on your mind?",
      "I hear you bro. Wanna talk more about what you're feeling?",
      "I'm here for you fam. What's been happening? Let's chat about it.",
      "Yo tell me more! What's going on with you?",
      "I'm all ears! What's up, talk to me!"
    ];
    return this.randomChoice(responses);
  }

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

export default new FallbackChatbot();
