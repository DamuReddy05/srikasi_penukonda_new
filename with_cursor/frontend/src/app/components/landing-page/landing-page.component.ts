import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  template: `
    <div class="landing-container">
      <!-- Top Utility Bar -->
      <div class="utility-bar">
        <div class="utility-left">
          <span class="date-time">{{ currentDateTime }}</span>
          <div class="social-icons">
            <i class="fab fa-facebook"></i>
            <i class="fab fa-twitter"></i>
            <i class="fab fa-youtube"></i>
            <i class="fab fa-instagram"></i>
            <i class="fab fa-pinterest"></i>
          </div>
        </div>
        <div class="utility-right">
          <a routerLink="/volunteer" class="utility-link">Volunteer</a>
          <a routerLink="/login" class="utility-link">SIGN IN / SIGN UP</a>
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>

      <!-- Main Header -->
      <header class="main-header">
        <div class="header-left">
          <div class="temple-logo">
            <div class="logo-symbol">🕉️</div>
          </div>
          <div class="temple-name">
            <h1>Sri Kasi Vishweswara Swamy Devasthanam</h1>
            <p>Penukonda</p>
          </div>
        </div>
        <nav class="main-nav">
          <a routerLink="/" class="nav-link">About</a>
          <a routerLink="/sevas" class="nav-link">Sevas & Darshanam</a>
          <a href="#" class="nav-link">Donations</a>
          <a href="#" class="nav-link">Support</a>
        </nav>
      </header>

      <!-- Hero Banner with Lord Shiva and Goddess Parvati -->
      <section class="hero-banner">
        <div class="banner-content" [ngClass]="'banner-' + currentBanner">
          <!-- Banner 1: Lord Shiva with Om -->
          <div class="banner-frame" *ngIf="currentBanner === 0">
            <div class="deity-image">
              <img src="assets/images/shiva-om.jpg" alt="Om Namah Shivaya" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="fallback-image">🕉️</div>
            </div>
            <h2 class="banner-text">Om Namah Shivaya</h2>
            <p class="banner-subtitle">Lord Shiva - The Destroyer and Transformer</p>
          </div>

          <!-- Banner 2: Goddess Parvati -->
          <div class="banner-frame" *ngIf="currentBanner === 1">
            <div class="deity-image">
              <img src="assets/images/parvati-goddess.jpg" alt="Jai Mata Di" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="fallback-image">🙏</div>
            </div>
            <h2 class="banner-text">Jai Mata Di</h2>
            <p class="banner-subtitle">Goddess Parvati - The Divine Mother</p>
          </div>

          <!-- Banner 3: Shiva Family -->
          <div class="banner-frame" *ngIf="currentBanner === 2">
            <div class="deity-image">
              <img src="assets/images/shiva-family.jpg" alt="Shiva Parvati Ganesha" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="fallback-image">👨‍👩‍👦</div>
            </div>
            <h2 class="banner-text">Shiva Parvati Ganesha</h2>
            <p class="banner-subtitle">The Divine Family - Blessing All Devotees</p>
          </div>
        </div>
        <div class="banner-nav">
          <button class="nav-arrow left-arrow" (click)="previousBanner()">‹</button>
          <div class="banner-dots">
            <span class="dot" [class.active]="currentBanner === 0" (click)="goToBanner(0)"></span>
            <span class="dot" [class.active]="currentBanner === 1" (click)="goToBanner(1)"></span>
            <span class="dot" [class.active]="currentBanner === 2" (click)="goToBanner(2)"></span>
          </div>
          <button class="nav-arrow right-arrow" (click)="nextBanner()">›</button>
        </div>
      </section>

      <!-- Temple News Ticker -->
      <section class="news-ticker">
        <div class="ticker-label">Temple News</div>
        <div class="ticker-content">
          <span class="ticker-text">Online Booking Procedure: Paroksha Seva | E-Hundi | Pratyaksha Seva at https://aptemples.ap.gov.in</span>
        </div>
        <a href="#" class="view-all">View All ></a>
      </section>

      <!-- Main Services Grid -->
      <section class="services-grid">
        <div class="service-card e-hundi">
          <div class="service-icon">💰</div>
          <h3>e-Hundi</h3>
          <p>e-Hundi allows donations from people across the globe for the welfare of the sacred Kasi Vishweswara Swamy Temple. Devotees can offer their donations via internet banking.</p>
          <a href="#" class="service-link">More info ></a>
          <button class="service-button">Donate Now ></button>
        </div>

        <div class="service-card paroksha-seva">
          <div class="service-icon">🕯️</div>
          <h3>Paroksha Seva</h3>
          <p>In a world filled with the essence of Shiva, one can now wholeheartedly worship Sri Kasi Vishweswara Swamy from anywhere in the world.</p>
          <a href="#" class="service-link">More info ></a>
          <button class="service-button">Book Now ></button>
        </div>

        <div class="service-card pratyaksha-seva">
          <div class="service-icon">🙏</div>
          <h3>Pratyaksha Seva</h3>
          <p>Experience the divine presence of Lord Shiva through direct darshan and participate in sacred rituals performed in person at the temple.</p>
          <a href="#" class="service-link">More info ></a>
          <button class="service-button">Book Now ></button>
        </div>

        <div class="service-card darshan">
          <div class="service-icon">🕉️</div>
          <h3>Darshan</h3>
          <p>Seek the divine blessings of Sri Kasi Vishweswara Swamy through special darshan timings and experience the spiritual energy of the sacred temple.</p>
          <a href="#" class="service-link">More info ></a>
          <button class="service-button">View Timings ></button>
        </div>

        <div class="service-card annadanam">
          <div class="service-icon">🍲</div>
          <h3>Annadanam</h3>
          <p>Offering one Annadhanam is equals to donating 1000 elephants, a crore cows, gold and land that extends until seashore: fulfilling all duties of a family.</p>
          <a href="#" class="service-link">More info ></a>
          <button class="service-button">Donate Now ></button>
        </div>

        <div class="service-card goseva">
          <div class="service-icon">🐄</div>
          <h3>Goseva</h3>
          <p>Serve and protect the sacred cows (Gau Mata) which are considered divine in Hindu culture. Support cow protection and care activities at the temple.</p>
          <a href="#" class="service-link">More info ></a>
          <button class="service-button">Support Now ></button>
        </div>
      </section>

      <!-- Hindu Calendar Section -->
      <section class="calendar-section">
        <div class="calendar-header">
          <h2>🕉️ Hindu Calendar - Events & Sevas</h2>
          <p>View upcoming events and sevas for the current month</p>
        </div>
        <div class="calendar-container">
          <app-calendar></app-calendar>
        </div>
      </section>

      <!-- About Temple Section -->
      <section class="about-section">
        <div class="about-content">
          <div class="about-text">
            <h2>About Sri Kasi Vishweswara Swamy Temple</h2>
            <p>Sri Kasi Vishweswara Swamy Temple in Penukonda is one of the most sacred temples dedicated to Lord Shiva. This ancient temple holds immense spiritual significance and is visited by thousands of devotees throughout the year.</p>
            <p>The temple is known for its divine atmosphere, ancient architecture, and the powerful presence of Lord Shiva. Devotees believe that worshipping here brings peace, prosperity, and spiritual enlightenment.</p>
            <button class="read-more-btn">Read More ></button>
          </div>
          <div class="about-grid">
            <div class="about-item">
              <div class="about-icon">🕯️</div>
              <h4>Pratyaksha Seva</h4>
              <button class="view-btn">View ></button>
            </div>
            <div class="about-image">
              <img src="assets/images/kumkum.jpg" alt="Sacred Kumkum" onerror="this.style.display='none'; this.innerHTML='Sacred Kumkum'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='#999';">
            </div>
            <div class="about-item">
              <div class="about-icon">🔗</div>
              <h4>Main Offerings</h4>
              <button class="view-btn">View ></button>
            </div>
            <div class="about-image">
              <img src="assets/images/temple-entrance.jpg" alt="Temple Entrance" onerror="this.style.display='none'; this.innerHTML='Temple Entrance'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='#999';">
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="main-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>About</h4>
            <ul>
              <li><a href="#">Overview</a></li>
              <li><a href="#">The Temple</a></li>
              <li><a href="#">The Temple Story</a></li>
              <li><a href="#">General Information</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Sevas & Darshanam</h4>
            <ul>
              <li><a href="#">Overview</a></li>
              <li><a href="#">Darshanam</a></li>
              <li><a href="#">Paroksha Seva</a></li>
              <li><a href="#">Pratyaksha Seva</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Online Booking</h4>
            <ul>
              <li><a href="#">Overview</a></li>
              <li><a href="#">Pratyaksha Seva Booking</a></li>
              <li><a href="#">Paroksha Seva Booking</a></li>
              <li><a href="#">Darshanam Tickets</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Overview</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Facilities to Pilgrims</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-info">
            <p>Sri Kasi Vishweswara Swamy Devasthanam, Penukonda - 515110, Anantapur (Dist.), Andhra Pradesh, India.</p>
            <p>Email: info&#64;srikasivishweswara.org | Website: www.srikasivishweswara.org</p>
          </div>
          <div class="footer-copyright">
            <p>© 2025 Sri Kasi Vishweswara Swamy Devasthanam. Privacy Policy | Terms & Conditions</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-container {
      font-family: 'Arial', sans-serif;
      color: #333;
    }

    /* Utility Bar */
    .utility-bar {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      color: white;
      padding: 8px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .utility-left, .utility-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .social-icons i {
      margin-right: 8px;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .social-icons i:hover {
      color: #8B4513;
    }

    .utility-link {
      color: white;
      text-decoration: none;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .utility-link:hover {
      color: #8B4513;
    }

    .search-icon {
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .search-icon:hover {
      color: #8B4513;
    }

    /* Main Header */
    .main-header {
      background: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .temple-logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .temple-name h1 {
      color: #8B4513;
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .temple-name p {
      color: #FF6B35;
      margin: 0;
      font-weight: 500;
    }

    .main-nav {
      display: flex;
      gap: 20px;
    }

    .nav-link {
      color: #333;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      background: #FF6B35;
      color: white;
    }

    /* Hero Banner */
    .hero-banner {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      padding: 60px 20px;
      position: relative;
      min-height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .hero-banner::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="om" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="10" y="15" font-size="12" fill="rgba(255,255,255,0.03)" text-anchor="middle">🕉️</text></pattern></defs><rect width="100" height="100" fill="url(%23om)"/></svg>');
      opacity: 0.1;
    }

    .banner-content {
      display: flex;
      gap: 50px;
      max-width: 1200px;
      width: 100%;
      position: relative;
      z-index: 2;
    }

    .banner-frame {
      flex: 1;
      background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 20px;
      padding: 40px 30px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .banner-frame::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: rotate(45deg);
      transition: all 0.6s ease;
      opacity: 0;
    }

    .banner-frame:hover::before {
      opacity: 1;
      transform: rotate(45deg) translate(50%, 50%);
    }

    .banner-frame:hover {
      transform: translateY(-10px);
      box-shadow: 0 30px 60px rgba(0,0,0,0.4);
    }

    .deity-image {
      width: 180px;
      height: 180px;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      margin: 0 auto 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 70px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .deity-image::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #FFD700, #FFA500, #FF6B35, #FFD700);
      border-radius: 50%;
      z-index: -1;
      animation: borderGlow 3s ease-in-out infinite alternate;
    }

    @keyframes borderGlow {
      0% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .deity-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      transition: transform 0.3s ease;
    }

    .deity-image:hover img {
      transform: scale(1.05);
    }

    .fallback-image {
      display: none;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-size: 70px;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .banner-text {
      color: white;
      font-size: 2.2rem;
      margin: 0 0 10px 0;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      background: linear-gradient(45deg, #FFD700, #FFA500, #FF6B35);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: textGlow 3s ease-in-out infinite alternate;
    }

    .banner-subtitle {
      color: rgba(255,255,255,0.9);
      font-size: 1.1rem;
      margin: 0;
      font-weight: 400;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
      animation: subtitleFade 3s ease-in-out infinite alternate;
    }

    @keyframes textGlow {
      0% { filter: brightness(1); }
      100% { filter: brightness(1.2); }
    }

    @keyframes subtitleFade {
      0% { opacity: 0.8; }
      100% { opacity: 1; }
    }

    /* Banner transitions */
    .banner-content {
      transition: all 0.5s ease-in-out;
    }

    .banner-frame {
      animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .banner-nav {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-arrow {
      background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      font-size: 28px;
      padding: 12px 16px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.4s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .nav-arrow:hover {
      background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1));
      transform: scale(1.15);
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      border-color: rgba(255,255,255,0.5);
    }

    .banner-dots {
      display: flex;
      gap: 10px;
    }

    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
      border: 1px solid rgba(255,255,255,0.3);
      cursor: pointer;
      transition: all 0.4s ease;
      position: relative;
    }

    .dot::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      background: rgba(255,255,255,0.5);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.4s ease;
    }

    .dot.active {
      background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2));
      border-color: rgba(255,255,255,0.8);
      transform: scale(1.2);
    }

    .dot.active::before {
      background: white;
      width: 8px;
      height: 8px;
    }

    .dot:hover {
      background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.15));
      transform: scale(1.1);
      border-color: rgba(255,255,255,0.6);
    }

    /* News Ticker */
    .news-ticker {
      background: #FF6B35;
      color: white;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .ticker-label {
      font-weight: bold;
      white-space: nowrap;
    }

    .ticker-content {
      flex: 1;
      overflow: hidden;
    }

    .ticker-text {
      animation: ticker 20s linear infinite;
      white-space: nowrap;
    }

    @keyframes ticker {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }

    .view-all {
      color: white;
      text-decoration: none;
      font-weight: bold;
    }

    /* Services Grid */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      padding: 40px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .service-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
      border-top: 4px solid #FF6B35;
    }

    .service-card:hover {
      transform: translateY(-5px);
    }

    .service-card.e-hundi {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-top-color: #FF6B35;
    }

    .service-card.paroksha-seva {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-top-color: #F7931E;
    }

    .service-card.pratyaksha-seva {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-top-color: #FF6B35;
    }

    .service-card.darshan {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-top-color: #F7931E;
    }

    .service-card.annadanam {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-top-color: #FF6B35;
    }

    .service-card.goseva {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      border-top-color: #F7931E;
    }

    .service-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    .service-card h3 {
      color: #8B4513;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    .service-card p {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .service-link {
      color: #FF6B35;
      text-decoration: none;
      font-weight: 500;
      display: block;
      margin-bottom: 15px;
    }

    .service-button {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .service-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255,107,53,0.3);
    }

    /* Calendar Section */
    .calendar-section {
      background: linear-gradient(135deg, #FFF8DC, #F5DEB3);
      padding: 30px 20px;
      text-align: center;
    }

    .calendar-header h2 {
      color: #8B4513;
      margin-bottom: 10px;
      font-size: 2rem;
    }

    .calendar-header p {
      color: #666;
      margin-bottom: 20px;
    }

    .calendar-container {
      width: 90%;
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    /* About Section */
    .about-section {
      padding: 40px 20px;
      background: white;
    }

    .about-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    .about-text h2 {
      color: #8B4513;
      margin-bottom: 20px;
      font-size: 2rem;
    }

    .about-text p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .read-more-btn {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .about-item {
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }

    .about-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .view-btn {
      background: rgba(255,255,255,0.2);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }

    .about-image {
      background: #f5f5f5;
      height: 120px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      overflow: hidden;
    }

    .about-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Footer */
    .main-footer {
      background: #8B4513;
      color: white;
      padding: 40px 20px 20px;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }

    .footer-section h4 {
      color: #FF6B35;
      margin-bottom: 15px;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
    }

    .footer-section ul li {
      margin-bottom: 8px;
    }

    .footer-section ul li a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section ul li a:hover {
      color: #FF6B35;
    }

    .footer-bottom {
      border-top: 1px solid #A0522D;
      padding-top: 20px;
      text-align: center;
    }

    .footer-info p {
      color: #ccc;
      margin-bottom: 10px;
    }

    .footer-copyright p {
      color: #999;
      font-size: 14px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .utility-bar {
        flex-direction: column;
        gap: 10px;
      }

      .main-header {
        flex-direction: column;
        gap: 20px;
      }

      .main-nav {
        flex-wrap: wrap;
        justify-content: center;
      }

      .banner-content {
        flex-direction: column;
        gap: 20px;
      }

      .services-grid {
        grid-template-columns: 1fr;
      }

      .about-content {
        grid-template-columns: 1fr;
      }

      .about-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingPageComponent implements OnInit {
  currentDateTime: string = '';
  currentBanner: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    
    // Auto-rotate banner every 5 seconds
    setInterval(() => {
      this.nextBanner();
    }, 5000);
  }

  updateDateTime(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    this.currentDateTime = now.toLocaleDateString('en-US', options);
  }

  previousBanner(): void {
    this.currentBanner = this.currentBanner > 0 ? this.currentBanner - 1 : 2;
  }

  nextBanner(): void {
    this.currentBanner = this.currentBanner < 2 ? this.currentBanner + 1 : 0;
  }

  goToBanner(index: number): void {
    this.currentBanner = index;
  }
}
