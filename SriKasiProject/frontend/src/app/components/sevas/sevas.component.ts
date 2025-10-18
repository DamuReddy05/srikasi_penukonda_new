import { Component } from '@angular/core';

@Component({
  selector: 'app-sevas',
  template: `
    <div class="sevas-container">
      <h1>🕯️ Sevas & Darshanam</h1>
      <p>View and book various sevas and darshanam services</p>
      <p>This page is under development - coming soon!</p>
    </div>
  `,
  styles: [`
    .sevas-container {
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
export class SevasComponent {}
