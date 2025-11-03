export class KittVoiceManager {
  constructor() {
    this.welcomeMessages = [
      "Michael, I'm online and ready to assist with your missions.",
      "The Knight Industries Task Manager is operational.",
      "Hello Michael, I'm here to help you organize your missions.",
      "All systems are functional. Ready for mission management."
    ];
    
    this.completionMessages = [
      "Excellent work, Michael. Mission accomplished.",
      "Target completed. Moving to next objective.",
      "Mission successful. Your efficiency is remarkable.",
      "Objective achieved. Shall we proceed to the next mission?"
    ];
    
    this.newMissionMessages = [
      "New mission logged and ready for execution.",
      "Mission parameters recorded. Added to active missions.",
      "Target acquired. Mission added to your queue.",
      "New objective registered. Ready when you are, Michael."
    ];
    
    this.waterLastReminder = localStorage.getItem('waterLastReminder');
    this.startSystemsCheck();
  }
  
  getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  showVoiceNotification(message) {
    const voiceElement = document.getElementById('kitt-voice');
    const messageElement = document.getElementById('voice-message');
    
    messageElement.textContent = `"${message}"`;
    voiceElement.classList.add('show');
    
    setTimeout(() => {
      voiceElement.classList.remove('show');
    }, 4000);
  }
  
  showWelcomeMessage() {
    this.showVoiceNotification(this.getRandomMessage(this.welcomeMessages));
  }
  
  showCompletionMessage() {
    this.showVoiceNotification(this.getRandomMessage(this.completionMessages));
  }
  
  showNewMissionMessage() {
    this.showVoiceNotification(this.getRandomMessage(this.newMissionMessages));
  }
  
  startSystemsCheck() {
    setInterval(() => {
      this.showSystemsCheck();
    }, 30 * 60 * 1000); // Every 30 minutes
  }
  
  showSystemsCheck() {
    const messages = [
      "Systems check: All functions operating within normal parameters.",
      "Performance scan complete. Mission efficiency at optimal levels.",
      "Routine diagnostics: All systems nominal. Continue mission protocols.",
      "Status update: Task management systems functioning at peak performance."
    ];
    this.showVoiceNotification(this.getRandomMessage(messages));
  }
  
  startWaterReminder() {
    setInterval(() => {
      this.showWaterReminder();
    }, 60 * 60 * 1000); // Every hour
  }
  
  showWaterReminder() {
    const now = new Date().getTime();
    const lastReminder = parseInt(this.waterLastReminder) || 0;
    
    if (now - lastReminder > 30 * 60 * 1000) {
      const messages = [
        "Michael, even advanced AI requires maintenance. Consider hydrating.",
        "Systems detect decreased efficiency. Recommendation: Hydrate for optimal performance.",
        "Mission parameters suggest a hydration break would increase effectiveness.",
        "Even KITT needs coolant. You should hydrate, Michael."
      ];
      this.showVoiceNotification(this.getRandomMessage(messages));
      this.waterLastReminder = now.toString();
      localStorage.setItem('waterLastReminder', this.waterLastReminder);
    }
  }
}
