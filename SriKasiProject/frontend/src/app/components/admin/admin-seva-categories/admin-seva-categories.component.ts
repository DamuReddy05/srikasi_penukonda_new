import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SevaService, SevaCategory } from '../../../services/seva.service';

@Component({
  selector: 'app-admin-seva-categories',
  template: `
    <div class="admin-categories-container">
      <!-- Header -->
      <div class="admin-header">
        <div class="header-left">
          <h1>📂 Seva Categories Management</h1>
          <p>Create and manage seva categories</p>
        </div>
        <div class="header-right">
          <button class="back-btn" (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
            Back to Sevas
          </button>
        </div>
      </div>

      <!-- Add Category Form -->
      <div class="add-category-section">
        <h2>➕ Add New Category</h2>
        <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="category-form">
          <div class="form-row">
            <div class="form-field">
              <label for="name">Category Name *</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                placeholder="Enter category name"
                class="form-input"
              >
              <div class="error-message" *ngIf="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched">
                Category name is required
              </div>
            </div>
            <div class="form-field">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                formControlName="description" 
                placeholder="Enter category description"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="categoryForm.invalid || isLoading"
            >
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">Add Category</span>
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

      <!-- Categories List -->
      <div class="categories-section">
        <h2>📂 All Categories</h2>
        <div class="categories-grid" *ngIf="categories && categories.length > 0; else noCategories">
          <div class="category-card" *ngFor="let category of categories">
            <div class="category-header">
              <h3>{{ category.name }}</h3>
              <div class="category-status">
                <span class="status-badge" [class]="category.is_active ? 'active' : 'inactive'">
                  {{ category.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
            <div class="category-content">
              <p class="category-description">{{ category.description || 'No description provided' }}</p>
              <div class="category-meta">
                <span class="meta-item">
                  <i class="fas fa-calendar"></i>
                  Created: {{ formatDate(category.created_at) }}
                </span>
                <span class="meta-item">
                  <i class="fas fa-clock"></i>
                  Updated: {{ formatDate(category.updated_at) }}
                </span>
              </div>
            </div>
            <div class="category-actions">
              <button class="action-btn edit" (click)="editCategory(category)">
                <i class="fas fa-edit"></i>
                Edit
              </button>
              <button class="action-btn delete" (click)="deleteCategory(category.id)">
                <i class="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
        <ng-template #noCategories>
          <div class="no-data">
            <p>No categories found ({{ categories?.length || 0 }} categories)</p>
            <p>Create your first category using the form above</p>
            <p *ngIf="categories === null">Loading categories...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .admin-categories-container {
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

    .add-category-section, .categories-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .add-category-section h2, .categories-section h2 {
      color: #1a237e;
      margin: 0 0 25px 0;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .category-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
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

    .form-input, .form-textarea {
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }

    .form-input:focus, .form-textarea:focus {
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

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .category-card {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .category-card:hover {
      border-color: #1a237e;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(26, 35, 126, 0.15);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .category-header h3 {
      color: #1a237e;
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
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

    .category-content {
      margin-bottom: 20px;
    }

    .category-description {
      color: #666;
      margin: 0 0 15px 0;
      font-size: 14px;
      line-height: 1.5;
    }

    .category-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .meta-item {
      color: #999;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .category-actions {
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
      .admin-categories-container {
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

      .categories-grid {
        grid-template-columns: 1fr;
      }

      .category-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminSevaCategoriesComponent implements OnInit, OnDestroy {
  categories: SevaCategory[] = [];
  categoryForm!: FormGroup;
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
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', []]
    });
  }

  loadCategories(): void {
    this.spinner.show();
    this.error = null;

    console.log('Loading categories...');
    this.sevaService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          console.log('Categories loaded:', categories);
          // Force change detection by creating a new array
          this.categories = [...categories];
          this.spinner.hide();
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.error = error.error?.message || 'Failed to load categories';
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

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      this.spinner.show();

      const categoryData = this.categoryForm.value;
      console.log('Creating category:', categoryData);

      this.sevaService.createCategory(categoryData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (category) => {
            console.log('Category created:', category);
            this.isLoading = false;
            this.spinner.hide();
            
            // Add the new category to the beginning of the list
            this.categories = [category, ...this.categories];
            
            // Reset the form
            this.resetForm();
            
            this.snackBar.open('Category created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error creating category:', error);
            this.isLoading = false;
            this.spinner.hide();
            
            const errorMessage = error.error?.message || 'Failed to create category';
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

  editCategory(category: SevaCategory): void {
    // TODO: Implement edit functionality
    this.snackBar.open('Edit functionality coming soon!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.spinner.show();

      this.sevaService.deleteCategory(categoryId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.spinner.hide();
            this.categories = this.categories.filter(cat => cat.id !== categoryId);
            
            this.snackBar.open('Category deleted successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.spinner.hide();
            
            const errorMessage = error.error?.message || 'Failed to delete category';
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
    console.log('Resetting form...');
    this.categoryForm.reset();
    // Mark all fields as pristine and untouched
    this.categoryForm.markAsPristine();
    this.categoryForm.markAsUntouched();
    // Force change detection
    this.categoryForm.updateValueAndValidity();
    console.log('Form reset complete');
  }

  formatDate(dateString: string): string {
    return this.sevaService.formatDate(dateString);
  }

  goBack(): void {
    this.router.navigate(['/admin/sevas']);
  }
}
