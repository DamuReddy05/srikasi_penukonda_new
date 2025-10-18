import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  template: `
    <div class="hindu-calendar">
      <!-- Calendar Header -->
      <div class="calendar-header-section">
        <div class="calendar-header">
          <button class="nav-btn" (click)="previousMonth()">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="month-year">
            <h3>{{ currentMonthName }}</h3>
            <span class="year">{{ currentYear }}</span>
          </div>
          <button class="nav-btn" (click)="nextMonth()">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="calendar-layout">
        <!-- Left Side - Beautiful Calendar -->
        <div class="calendar-left">
          <div class="calendar-container">
            <!-- Weekdays Header -->
            <div class="weekdays">
              <div class="weekday" *ngFor="let day of weekDays">
                <span class="day-name">{{ day }}</span>
              </div>
            </div>
            
            <!-- Calendar Grid -->
            <div class="days-grid">
              <div 
                *ngFor="let day of calendarDays" 
                class="day-cell"
                [class.other-month]="!day.isCurrentMonth"
                [class.today]="day.isToday"
                [class.has-event]="day.hasEvent"
                [class.selected]="selectedDay && selectedDay.fullDate === day.fullDate"
                (click)="selectDay(day)"
              >
                <div class="day-content">
                  <div class="day-number">{{ day.date }}</div>
                  <div *ngIf="day.hinduDate" class="hindu-date">{{ day.hinduDate }}</div>
                  <div *ngIf="day.hasEvent" class="event-indicator">
                    <div class="event-dot"></div>
                  </div>
                </div>
                <div class="day-background"></div>
              </div>
            </div>
          </div>
          
          <!-- Calendar Legend -->
          <div class="calendar-legend">
            <div class="legend-title">📅 Calendar Guide</div>
            <div class="legend-items">
              <div class="legend-item">
                <div class="legend-dot today"></div>
                <span>Today</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot event"></div>
                <span>Events & Sevas</span>
              </div>
              <div class="legend-item">
                <div class="legend-dot special"></div>
                <span>Special Days</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Side - Events Panel -->
        <div class="events-right">
          <div class="events-panel" *ngIf="selectedDay">
            <div class="panel-header">
              <div class="date-icon">📅</div>
              <div class="date-info">
                <h4>{{ selectedDay.fullDate | date:'EEEE, MMMM d, y' }}</h4>
                <span class="hindu-date-display">{{ selectedDay.hinduDate }}</span>
              </div>
            </div>
            
            <div class="events-list">
              <div *ngFor="let event of selectedDay.events" class="event-card">
                <div class="event-header">
                  <div class="event-icon">🕉️</div>
                  <div class="event-title">{{ event.title }}</div>
                  <div class="event-time-badge">{{ event.time }}</div>
                </div>
                <div class="event-description">{{ event.description }}</div>
                <div class="event-actions">
                  <button class="action-btn book-btn">Book Seva</button>
                  <button class="action-btn details-btn">View Details</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="no-events" *ngIf="!selectedDay">
            <div class="no-events-content">
              <div class="no-events-icon">🙏</div>
              <h4>Select a Sacred Date</h4>
              <p>Click on any date in the calendar to view the divine events and sevas scheduled for that auspicious day.</p>
              <div class="spiritual-quote">
                "Every day is a blessing, every moment is divine" 🕉️
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hindu-calendar {
      font-family: 'Arial', sans-serif;
      max-width: 100%;
      background: linear-gradient(135deg, #FFF8DC 0%, #F5DEB3 100%);
      border-radius: 20px;
      padding: 10px;
      box-shadow: 0 10px 30px rgba(139, 69, 19, 0.1);
    }

    /* Calendar Header Section */
    .calendar-header-section {
      text-align: center;
      margin-bottom: 8px;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      border-radius: 15px;
      padding: 8px 12px;
      box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
      margin: 0;
    }

    .nav-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
    }

    .month-year {
      text-align: center;
    }

    .month-year h3 {
      color: white;
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .year {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      font-weight: 500;
    }

    /* Calendar Layout */
    .calendar-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      align-items: start;
    }

    .calendar-left {
      background: white;
      border-radius: 20px;
      padding: 10px;
      box-shadow: 0 8px 25px rgba(139, 69, 19, 0.1);
    }

    .calendar-container {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-radius: 15px;
      overflow: hidden;
      box-shadow: inset 0 2px 10px rgba(139, 69, 19, 0.1);
    }

    /* Weekdays */
    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: linear-gradient(135deg, #8B4513, #A0522D);
      color: white;
      padding: 10px 0;
    }

    .weekday {
      text-align: center;
      padding: 8px 5px;
      position: relative;
    }

    .day-name {
      font-weight: bold;
      font-size: 14px;
      display: block;
      margin-bottom: 5px;
    }

    .day-decoration {
      font-size: 12px;
      opacity: 0.7;
    }

    /* Days Grid */
    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: white;
    }

    .day-cell {
      position: relative;
      min-height: 55px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid #f0f0f0;
      overflow: hidden;
    }

    .day-cell:hover {
      transform: scale(1.05);
      z-index: 2;
    }

    .day-content {
      position: relative;
      z-index: 2;
      padding: 4px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow: hidden;
    }

    .day-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .day-cell:hover .day-background {
      opacity: 1;
    }

    .day-cell.other-month {
      background: #f9f9f9;
      color: #ccc;
    }

    .day-cell.today {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
    }

    .day-cell.has-event {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
    }

    .day-cell.has-event.today {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
    }

    .day-cell.selected {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      color: white;
      transform: scale(1.08);
      box-shadow: 0 8px 25px rgba(255, 107, 53, 0.5);
      z-index: 3;
    }

    .day-number {
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2px;
      line-height: 1;
    }

    .hindu-date {
      font-size: 8px;
      color: #666;
      text-align: center;
      line-height: 1.1;
      margin-top: 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .day-cell.today .hindu-date,
    .day-cell.selected .hindu-date {
      color: rgba(255, 255, 255, 0.8);
    }

    .event-indicator {
      position: absolute;
      top: 1px;
      right: 1px;
    }

    .event-dot {
      width: 6px;
      height: 6px;
      background: #27ae60;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(39, 174, 96, 0.3);
    }

    /* Calendar Legend */
    .calendar-legend {
      margin-top: 8px;
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-radius: 12px;
      padding: 8px;
      text-align: center;
    }

    .legend-title {
      color: #8B4513;
      font-weight: bold;
      margin-bottom: 15px;
      font-size: 16px;
    }

    .legend-items {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #8B4513;
    }

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .legend-dot.today {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
    }

    .legend-dot.event {
      background: #27ae60;
    }

    .legend-dot.special {
      background: #9b59b6;
    }

    /* Right Side - Events Panel */
    .events-right {
      background: white;
      border-radius: 20px;
      padding: 10px;
      box-shadow: 0 8px 25px rgba(139, 69, 19, 0.1);
      min-height: 250px;
    }

    .events-panel h4 {
      color: #8B4513;
      margin-bottom: 15px;
      border-bottom: 3px solid #FF6B35;
      padding-bottom: 10px;
      font-size: 18px;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 18px;
      padding: 14px;
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-radius: 12px;
      border-left: 4px solid #FF6B35;
    }

    .date-icon {
      font-size: 32px;
    }

    .date-info h4 {
      color: #8B4513;
      margin: 0 0 5px 0;
      font-size: 18px;
      border: none;
      padding: 0;
    }

    .hindu-date-display {
      color: #FF6B35;
      font-size: 14px;
      font-weight: 500;
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .event-card {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-radius: 15px;
      padding: 14px;
      border-left: 5px solid #FF6B35;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(139, 69, 19, 0.1);
    }

    .event-card:hover {
      transform: translateX(8px);
      box-shadow: 0 8px 25px rgba(139, 69, 19, 0.2);
    }

    .event-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;
    }

    .event-icon {
      font-size: 28px;
    }

    .event-title {
      flex: 1;
      color: #8B4513;
      font-size: 18px;
      font-weight: bold;
    }

    .event-time-badge {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
    }

    .event-description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 14px;
      font-size: 14px;
    }

    .event-actions {
      display: flex;
      gap: 10px;
    }

    .action-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .book-btn {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      color: white;
    }

    .book-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
    }

    .details-btn {
      background: rgba(255, 107, 53, 0.1);
      color: #FF6B35;
      border: 1px solid #FF6B35;
    }

    .details-btn:hover {
      background: #FF6B35;
      color: white;
    }

    /* No Events State */
    .no-events {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .no-events-content {
      text-align: center;
      padding: 28px 14px;
      color: #666;
    }

    .no-events-icon {
      font-size: 45px;
      margin-bottom: 14px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .no-events h4 {
      color: #8B4513;
      margin-bottom: 15px;
      font-size: 20px;
    }

    .no-events p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: 16px;
    }

    .spiritual-quote {
      color: #FF6B35;
      font-style: italic;
      font-size: 14px;
      margin-top: 20px;
      padding: 15px;
      background: rgba(255, 107, 53, 0.1);
      border-radius: 8px;
      border-left: 3px solid #FF6B35;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .calendar-layout {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .calendar-header {
        padding: 15px 20px;
      }

      .month-year h3 {
        font-size: 1.5rem;
      }

      .day-cell {
        min-height: 60px;
      }

      .day-number {
        font-size: 14px;
      }

      .hindu-date {
        font-size: 8px;
      }

      .legend-items {
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .events-right {
        min-height: 400px;
      }

      .event-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .event-actions {
        flex-direction: column;
      }
    }
  `]
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  calendarDays: any[] = [];
  selectedDay: any = null;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit(): void {
    this.generateCalendar();
  }

  get currentMonthName(): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[this.currentMonth];
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === this.currentMonth;
      const isToday = date.toDateString() === today.toDateString();
      const hasEvent = this.hasEventOnDate(date);

      this.calendarDays.push({
        date: date.getDate(),
        fullDate: date.toDateString(),
        isCurrentMonth,
        isToday,
        hasEvent,
        hinduDate: this.getHinduDate(date),
        events: hasEvent ? this.getEventsForDate(date) : []
      });
    }
  }

  hasEventOnDate(date: Date): boolean {
    const events = this.getMockEvents();
    return events.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  }

  getEventsForDate(date: Date): any[] {
    const events = this.getMockEvents();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  }

  getHinduDate(date: Date): string {
    const hinduMonths = [
      'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
      'Shravana', 'Bhadrapada', 'Ashwin', 'Kartika',
      'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
    ];
    
    const day = date.getDate();
    const month = date.getMonth();
    
    const hinduDay = day;
    const hinduMonth = hinduMonths[month];
    
    // Return full month names with better spacing
    return `${hinduDay} ${hinduMonth}`;
  }

  getMockEvents(): any[] {
    return [
      {
        date: new Date(this.currentYear, this.currentMonth, 15),
        title: 'Maha Shivaratri',
        description: 'Special night dedicated to Lord Shiva with special pujas and abhishekam. Experience the divine energy and spiritual awakening.',
        time: '6:00 PM - 6:00 AM'
      },
      {
        date: new Date(this.currentYear, this.currentMonth, 8),
        title: 'Rudrabhishekam',
        description: 'Sacred ritual offering to Lord Shiva with 108 names chanting. Purify your soul and seek divine blessings.',
        time: '9:00 AM - 11:00 AM'
      },
      {
        date: new Date(this.currentYear, this.currentMonth, 22),
        title: 'Lingodbhavam',
        description: 'Special darshan of Lord Shiva in the form of Jyotirlinga. Witness the divine manifestation.',
        time: '4:00 AM - 6:00 AM'
      },
      {
        date: new Date(this.currentYear, this.currentMonth, 1),
        title: 'Monthly Abhishekam',
        description: 'Monthly ritual bath of the main deity with sacred substances. Begin your month with divine blessings.',
        time: '6:00 AM - 8:00 AM'
      }
    ];
  }

  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
    this.selectedDay = null;
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
    this.selectedDay = null;
  }

  selectDay(day: any): void {
    this.selectedDay = day;
  }
}

