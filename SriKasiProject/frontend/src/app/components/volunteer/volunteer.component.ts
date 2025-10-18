import { Component } from '@angular/core';

@Component({
  selector: 'app-volunteer',
  template: `
    <div class="volunteer-container">
      <h1>🤝 Volunteer Services</h1>
      <p>Join our volunteer program and serve the temple</p>
      <p>This page is under development - coming soon!</p>
    </div>
  `,
  styles: [`
    .volunteer-container {
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
export class VolunteerComponent {}
