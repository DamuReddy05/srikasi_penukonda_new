import { Component } from '@angular/core';

@Component({
  selector: 'app-bookings',
  template: `
    <div class="bookings-container">
      <h1>📅 Online Bookings</h1>
      <p>Book your sevas, darshanam, and accommodation</p>
      <p>This page is under development - coming soon!</p>
    </div>
  `,
  styles: [`
    .bookings-container {
      padding: 40px;
      text-align: center;
    }
    
    h1 {
      color: #1a237e;
      margin-bottom: 20px;
    }
    
    p {
      color: #666;
      margin-bottom: 10px;
    }
  `]
})
export class BookingsComponent {}
