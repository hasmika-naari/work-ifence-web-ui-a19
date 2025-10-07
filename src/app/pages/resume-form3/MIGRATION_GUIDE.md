# Resume Form Components Migration Guide

## ✅ Completed Components (Bio-Form Style Applied)

1. **Contact Component** - ✅ Fully migrated
2. **Experience Component** - ✅ Fully migrated  
3. **Education Component** - ✅ Fully migrated

## 📋 Remaining Components to Update

The following components still use Angular Material `mat-form-field` and need to be converted to the `.field` pattern:

1. **project** (project.component.html/scss)
2. **summary** (summary.component.html/scss)
3. **certification** (certification.component.html/scss)
4. **course-work** (course-work.component.html/scss)
5. **skills** (skills.component.html/scss)
6. **achievements** (achievements.component.html/scss)
7. **accomplishments** (accomplishments.component.html/scss)
8. **job-description** (job-description.component.html/scss)
9. **resume-title** (resume-title.component.html/scss)

## 🎯 Migration Pattern

### Step 1: Update HTML Template

**OLD Pattern (Angular Material):**
```html
<div class="row h-100 pl-4 pr-4">
    <div class="col-12">
        <form [formGroup]="myForm">
            <div class="row wrap">
                <div class="col-12 p-b-1 p-t-2">
                    <mat-form-field appearance="outline" class="w-100">
                        <mat-label>Field Label</mat-label>
                        <input matInput placeholder="..." formControlName="fieldName">
                        <mat-error *ngIf="myForm.get('fieldName')?.hasError('required')">
                            Required.
                        </mat-error>
                    </mat-form-field>
                </div>
            </div>
        </form>
    </div>
</div>
```

**NEW Pattern (Bio-Form Style):**
```html
<div class="resume-form-container">
    <form [formGroup]="myForm">
        
        <div class="form-row form-row--single">
            <div class="field">
                <label for="fieldName">Field Label *</label>
                <input 
                    id="fieldName" 
                    type="text" 
                    pInputText 
                    formControlName="fieldName" 
                    placeholder="Enter..."
                />
                <small class="error" *ngIf="myForm.get('fieldName')?.hasError('required') && (myForm.get('fieldName')?.dirty || myForm.get('fieldName')?.touched)">
                    Required.
                </small>
            </div>
        </div>

        <!-- For two fields side-by-side -->
        <div class="form-row form-row--double">
            <div class="field">
                <label for="field1">Field 1 *</label>
                <input 
                    id="field1" 
                    type="text" 
                    pInputText 
                    formControlName="field1" 
                    placeholder="..."
                />
            </div>

            <div class="field">
                <label for="field2">Field 2</label>
                <input 
                    id="field2" 
                    type="text" 
                    pInputText 
                    formControlName="field2" 
                    placeholder="..."
                />
            </div>
        </div>

        <!-- Buttons -->
        <div class="form-actions">
            <button 
                type="button" 
                class="action-btn action-btn--primary" 
                (click)="saveAndContinue()" 
                [disabled]="myForm.invalid">
                <i class="pi pi-check"></i>
                Add to Resume
            </button>
        </div>
    </form>
</div>
```

### Step 2: Update SCSS File

**Replace the top of component.scss with:**
```scss
// Import shared form field styling
@import '../shared-form-styles';

:host {
  font-family: 'Poppins', sans-serif;
}

:host{
  .mat-icon{
      font-family: 'Material Icons' !important;
  }
}

// Form container with proper padding
.resume-form-container {
  padding: 1.5rem 1rem;
  max-width: 100%;
}

// Keep any component-specific styles below...
```

### Step 3: Key Conversion Rules

| Old (Material) | New (Bio-Form) |
|----------------|----------------|
| `matInput` | `pInputText` |
| `<mat-form-field>` | `<div class="field">` |
| `<mat-label>` | `<label for="id">` |
| `<mat-error>` | `<small class="error">` |
| `class="col-12 p-b-1 p-t-2"` | `<div class="form-row form-row--single">` |
| `class="col-6 p-b-1 p-t-2"` (two fields) | `<div class="form-row form-row--double">` |

### Step 4: Textarea Pattern

For text areas (like summary, description fields):
```html
<div class="form-row form-row--single">
    <div class="field">
        <label for="description">Description</label>
        <textarea 
            id="description" 
            pInputTextarea 
            formControlName="description" 
            rows="5"
            placeholder="Enter description..."
        ></textarea>
    </div>
</div>
```

### Step 5: PrimeNG Calendar/Dropdown Pattern

If using PrimeNG components:
```html
<div class="field">
    <label for="startDate">Start Date *</label>
    <p-calendar 
        formControlName="startDate" 
        dateFormat="yy-mm-dd" 
        inputId="startDate" 
        placeholder="YYYY-MM-DD"
    ></p-calendar>
</div>
```

### Step 6: Verify Imports

Ensure the TypeScript component imports:
```typescript
imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,      // For pInputText
    InputTextareaModule,  // For pInputTextarea
    ButtonModule,         // For p-button
    CalendarModule,       // For p-calendar
    DropdownModule,       // For p-dropdown
    // ... other imports
]
```

## 📝 Special Cases

### Components with Rich Text Editors (Experience, Summary, Project)
- Keep the Quill editor container: `<div #editorContainer>`
- Wrap it in a `.field` div with a label
- Position AI buttons absolutely if needed

### Components with Date Pickers
- Material datepickers can stay as `mat-form-field` temporarily
- Or convert to PrimeNG `p-calendar` for consistency

### Components with Checkboxes
- Material checkboxes can remain as `mat-checkbox`
- Style them separately if needed

## 🎨 Button Styling

Use the new action button classes:
- `.action-btn` - Base class
- `.action-btn--primary` - Primary action (saves, submits)
- `.action-btn--ghost` - Secondary action (cancel)

Example:
```html
<div class="form-actions">
    <button 
        type="button" 
        class="action-btn action-btn--ghost" 
        (click)="cancel()">
        Cancel
    </button>
    <button 
        type="button" 
        class="action-btn action-btn--primary" 
        (click)="save()" 
        [disabled]="form.invalid">
        <i class="pi pi-check"></i>
        Save
    </button>
</div>
```

## ✨ Benefits of This Pattern

1. **Consistent UI** - All forms look the same
2. **Clean Design** - No floating labels, clear label-above-input
3. **Better UX** - Light primary button colors, proper spacing
4. **Maintainable** - Shared SCSS file for all form components
5. **Responsive** - Auto-stacks on mobile (640px breakpoint)
6. **Accessible** - Proper label/input associations with `for` attribute

## 🚀 Quick Start for Each Component

1. Open component HTML file
2. Replace outer `<div class="row h-100">` with `<div class="resume-form-container">`
3. Replace each `<mat-form-field>` block with `.field` pattern
4. Update buttons to use `.form-actions` and `.action-btn` classes
5. Open component SCSS file
6. Add `@import '../shared-form-styles';` at the top
7. Add `.resume-form-container { padding: 1.5rem 1rem; max-width: 100%; }`
8. Test in browser within the drawer

## 📊 Progress Tracker

- [x] _shared-form-styles.scss created
- [x] contact (3 files)
- [x] experiance (2 files)
- [x] education (2 files)
- [ ] project (2 files)
- [ ] summary (2 files)
- [ ] certification (2 files)
- [ ] course-work (2 files)
- [ ] skills (2 files)
- [ ] achievements (2 files)
- [ ] accomplishments (2 files)
- [ ] job-description (2 files)
- [ ] resume-title (2 files)

**Progress: 7/21 files completed (33%)**

## 🔍 Testing Checklist

After updating each component:
- [ ] Form renders correctly in drawer
- [ ] Labels are visible and properly positioned
- [ ] Inputs are styled consistently
- [ ] Validation errors display correctly
- [ ] Buttons have light primary color
- [ ] Form is responsive (test at 450px width)
- [ ] Save functionality still works
- [ ] No console errors

---

**Note:** This migration maintains all existing functionality while improving the visual consistency across all resume editor forms. The drawer width is set to 35vw (min: 450px, max: 600px) which provides optimal viewing for these forms.
