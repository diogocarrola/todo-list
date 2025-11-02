export class MotivationManager {
  constructor() {
    this.waterIntervalId = null;
  }

  showMotivationNotification(message = 'Great job — keep going!') {
    const el = document.createElement('div');
    el.className = 'motivation-notification';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => {
      el.classList.add('hide');
    }, 4200);
    setTimeout(() => el.remove(), 5200);
  }

  startWaterReminders(minutes = 60) {
    // clear existing
    if (this.waterIntervalId) clearInterval(this.waterIntervalId);
    const ms = Math.max(1, minutes) * 60 * 1000;
    this.waterIntervalId = setInterval(() => {
      this.showMotivationNotification('Time to drink water 💧 — take a quick break!');
    }, ms);
  }

  stopWaterReminders() {
    if (this.waterIntervalId) {
      clearInterval(this.waterIntervalId);
      this.waterIntervalId = null;
    }
  }
}

export default MotivationManager;
