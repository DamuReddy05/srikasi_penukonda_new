import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SevaService, Seva, SevaCategory } from '../../../services/seva.service';

@Component({
  selector: 'app-admin-seva-management',
  template: `
    <div class="admin-seva-management-container">
      <!-- Header -->
      <div class="admin-header">
        <div class="header-left">
          <h1>🕉️ Seva Management</h1>
          <p>Create and manage individual sevas</p>
        </div>
        <div class="header-right">
          <button class="back-btn" (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
            Back to Sevas
          </button>
        </div>
      </div>

      <!-- Add Seva Form -->
      <div class="add-seva-section">
        <h2>➕ Add New Seva</h2>
        <form [formGroup]="sevaForm" (ngSubmit)="onSubmit()" class="seva-form">
          <div class="form-row">
            <div class="form-field">
              <label for="name">Seva Name *</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                placeholder="Enter seva name"
                class="form-input"
              >
              <div class="error-message" *ngIf="sevaForm.get('name')?.invalid && sevaForm.get('name')?.touched">
                Seva name is required
              </div>
            </div>
            <div class="form-field">
              <label for="seva_type">Seva Type *</label>
              <select id="seva_type" formControlName="seva_type" class="form-select">
                <option value="">Select seva type</option>
                <option value="pratyaksha">Pratyaksha Seva</option>
                <option value="paroksha">Paroksha Seva</option>
              </select>
              <div class="error-message" *ngIf="sevaForm.get('seva_type')?.invalid && sevaForm.get('seva_type')?.touched">
                Seva type is required
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="category_id">Category *</label>
              <select id="category_id" formControlName="category_id" class="form-select">
                <option value="">Select category ({{ categories?.length || 0 }} available)</option>
                <option *ngFor="let category of categories" [value]="category.id">
                  {{ category.name }}
                </option>
              </select>
              <div class="error-message" *ngIf="sevaForm.get('category_id')?.invalid && sevaForm.get('category_id')?.touched">
                Category is required
              </div>
            </div>
            <div class="form-field">
              <label for="base_cost">Base Cost (₹) *</label>
              <input 
                type="number" 
                id="base_cost" 
                formControlName="base_cost" 
                placeholder="Enter base cost"
                class="form-input"
                min="0"
                step="0.01"
              >
              <div class="error-message" *ngIf="sevaForm.get('base_cost')?.invalid && sevaForm.get('base_cost')?.touched">
                Base cost is required and must be positive
              </div>
            </div>
          </div>

          <div class="form-field">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              formControlName="description" 
              placeholder="Enter seva description"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-field">
            <label for="how_performed">How Performed</label>
            <textarea 
              id="how_performed" 
              formControlName="how_performed" 
              placeholder="Describe how this seva is performed"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="duration">Duration</label>
              <input 
                type="text" 
                id="duration" 
                formControlName="duration" 
                placeholder="e.g., 1 hour, 30 minutes"
                class="form-input"
              >
            </div>
            <div class="form-field">
              <label for="max_participants">Max Participants</label>
              <input 
                type="number" 
                id="max_participants" 
                formControlName="max_participants" 
                placeholder="Leave blank for unlimited"
                class="form-input"
                min="1"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="start_time">Start Time</label>
              <input 
                type="time" 
                id="start_time" 
                formControlName="start_time" 
                class="form-input"
              >
            </div>
            <div class="form-field">
              <label for="end_time">End Time</label>
              <input 
                type="time" 
                id="end_time" 
                formControlName="end_time" 
                class="form-input"
              >
            </div>
          </div>

          <div class="form-field">
            <label for="temple_provides">Temple Provides</label>
            <textarea 
              id="temple_provides" 
              formControlName="temple_provides" 
              placeholder="What materials/items does the temple provide?"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-field">
            <label for="devotee_brings">Devotee Brings</label>
            <textarea 
              id="devotee_brings" 
              formControlName="devotee_brings" 
              placeholder="What should devotees bring?"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-field">
            <label for="benefits">Benefits</label>
            <textarea 
              id="benefits" 
              formControlName="benefits" 
              placeholder="What are the benefits of performing this seva?"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="sevaForm.invalid || isLoading"
            >
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">Add Seva</span>
            </button>
            <button 
              type="button" 
              class="btn-secondary"
              (click)="resetForm()"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <!-- Sevas List -->
      <div class="sevas-section">
        <h2>🕉️ All Sevas</h2>
        <div class="sevas-grid" *ngIf="sevas && sevas.length > 0; else noSevas">
          <div class="seva-card" *ngFor="let seva of sevas">
            <div class="seva-header">
              <h3>{{ seva.name }}</h3>
              <div class="seva-status">
                <span class="status-badge" [class]="seva.is_active ? 'active' : 'inactive'">
                  {{ seva.is_active ? 'Active' : 'Inactive' }}
                </span>
                <span class="type-badge" [class]="seva.seva_type">
                  {{ sevaService.getSevaTypeLabel(seva.seva_type) }}
                </span>
              </div>
            </div>
            <div class="seva-content">
              <div class="seva-info">
                <div class="info-row">
                  <span class="info-label">Category:</span>
                  <span class="info-value">{{ seva.category.name }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Cost:</span>
                  <span class="info-value">{{ sevaService.formatCurrency(seva.base_cost) }}</span>
                </div>
                <div class="info-row" *ngIf="seva.duration">
                  <span class="info-label">Duration:</span>
                  <span class="info-value">{{ seva.duration }}</span>
                </div>
                <div class="info-row" *ngIf="seva.max_participants">
                  <span class="info-label">Max Participants:</span>
                  <span class="info-value">{{ seva.max_participants }}</span>
                </div>
              </div>
              
              <div class="seva-description" *ngIf="seva.description">
                <p>{{ seva.description }}</p>
              </div>
            </div>
            <div class="seva-actions">
              <button class="action-btn edit" (click)="editSeva(seva)">
                <i class="fas fa-edit"></i>
                Edit
              </button>
              <button class="action-btn delete" (click)="deleteSeva(seva.id)">
                <i class="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
        <ng-template #noSevas>
          <div class="no-data">
            <p>No sevas found ({{ sevas?.length || 0 }} sevas)</p>
            <p>Create your first seva using the form above</p>
            <p *ngIf="sevas === null">Loading sevas...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .admin-seva-management-container {
      padding: 30px;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .admin-header {
      background: white;
      border-radius: 12px;
      padding: 20px 30px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header-left h1 {
      color: #1a237e;
      margin: 0 0 5px 0;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .header-left p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .back-btn {
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
    }

    .add-seva-section, .sevas-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .add-seva-section h2, .sevas-section h2 {
      color: #1a237e;
      margin: 0 0 25px 0;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .seva-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-field label {
      color: #1a237e;
      font-weight: 500;
      font-size: 14px;
    }

    .form-input, .form-select, .form-textarea {
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #1a237e;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .error-message {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #666;
      border: 2px solid #e0e0e0;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .sevas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .seva-card {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .seva-card:hover {
      border-color: #1a237e;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(26, 35, 126, 0.15);
    }

    .seva-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .seva-header h3 {
      color: #1a237e;
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .seva-status {
      display: flex;
      gap: 8px;
    }

    .status-badge, .type-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 500;
    }

    .status-badge.active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.inactive {
      background: #ffebee;
      color: #c62828;
    }

    .type-badge.pratyaksha {
      background: #e3f2fd;
      color: #1976d2;
    }

    .type-badge.paroksha {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .seva-content {
      margin-bottom: 20px;
    }

    .seva-info {
      margin-bottom: 15px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .info-label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .info-value {
      color: #1a237e;
      font-size: 14px;
      font-weight: 600;
    }

    .seva-description {
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
    }

    .seva-description p {
      color: #666;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }

    .seva-actions {
      display: flex;
      gap: 10px;
    }

    .action-btn {
      flex: 1;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.3s ease;
    }

    .action-btn.edit {
      background: #e3f2fd;
      color: #1976d2;
    }

    .action-btn.edit:hover {
      background: #bbdefb;
    }

    .action-btn.delete {
      background: #ffebee;
      color: #d32f2f;
    }

    .action-btn.delete:hover {
      background: #ffcdd2;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-data p {
      margin: 0 0 10px 0;
      font-size: 16px;
    }

    .no-data p:last-child {
      font-size: 14px;
      color: #999;
    }

    @media (max-width: 768px) {
      .admin-seva-management-container {
        padding: 15px;
      }

      .admin-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .sevas-grid {
        grid-template-columns: 1fr;
      }

      .seva-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminSevaManagementComponent implements OnInit, OnDestroy {
  sevas: Seva[] = [];
  categories: SevaCategory[] = [];
  sevaForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public sevaService: SevaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadSevas();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.sevaForm = this.fb.group({
      name: ['', [Validators.required]],
      seva_type: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      description: ['', []],
      how_performed: ['', []],
      duration: ['', []],
      start_time: ['', []],
      end_time: ['', []],
      base_cost: ['', [Validators.required, Validators.min(0)]],
      currency: ['INR', []],
      temple_provides: ['', []],
      devotee_brings: ['', []],
      benefits: ['', []],
      images: [[], []],
      is_active: [true, []],
      max_participants: ['', []]
    });
  }

  loadSevas(): void {
    this.spinner.show();
    this.error = null;

    this.sevaService.getSevas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sevas) => {
          // Force change detection by creating a new array
          this.sevas = [...sevas];
          this.spinner.hide();
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to load sevas';
          this.spinner.hide();
          
          this.snackBar.open(this.error || 'Unknown error occurred', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  loadCategories(): void {
    console.log('Loading categories for seva management...');
    this.sevaService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          console.log('Categories loaded for seva management:', categories);
          // Force change detection by creating a new array
          this.categories = [...categories];
        },
        error: (error) => {
          console.error('Failed to load categories for seva management:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.sevaForm.valid) {
      this.isLoading = true;
      this.spinner.show();

      const sevaData = this.sevaForm.value;

      this.sevaService.createSeva(sevaData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (seva) => {
            this.isLoading = false;
            this.spinner.hide();
            
            // Add the new seva to the beginning of the list
            this.sevas = [seva, ...this.sevas];
            this.resetForm();
            
            this.snackBar.open('Seva created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.isLoading = false;
            this.spinner.hide();
            
            const errorMessage = error.error?.message || 'Failed to create seva';
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  editSeva(seva: Seva): void {
    // TODO: Implement edit functionality
    this.snackBar.open('Edit functionality coming soon!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  deleteSeva(sevaId: number): void {
    if (confirm('Are you sure you want to delete this seva?')) {
      this.spinner.show();

      this.sevaService.deleteSeva(sevaId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.spinner.hide();
            this.sevas = this.sevas.filter(seva => seva.id !== sevaId);
            
            this.snackBar.open('Seva deleted successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.spinner.hide();
            
            const errorMessage = error.error?.message || 'Failed to delete seva';
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  resetForm(): void {
    this.sevaForm.reset({
      currency: 'INR',
      is_active: true
    });
    // Mark all fields as pristine and untouched
    this.sevaForm.markAsPristine();
    this.sevaForm.markAsUntouched();
    // Force change detection
    this.sevaForm.updateValueAndValidity();
  }

  goBack(): void {
    this.router.navigate(['/admin/sevas']);
  }
}
