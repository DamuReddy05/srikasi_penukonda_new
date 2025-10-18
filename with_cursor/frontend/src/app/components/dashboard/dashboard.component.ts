import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h1>🕉️ Devotee Dashboard</h1>
      <p>Welcome to Sri Kasi Vishweswara Swamy Devasthanam</p>
      <p>This is the devotee dashboard - coming soon!</p>
    </div>
  `,
  styles: [`
    .dashboard-container {
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
export class DashboardComponent {}
