import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatTableModule, MatPaginatorModule, MatInputModule, MatSortModule,
  MatFormFieldModule, MatIconModule, MatSelectModule, MatDatepickerModule,
  MatNativeDateModule, MatAutocompleteModule, MatCardModule, MatExpansionModule,
  MatButtonModule, MatDialogModule, MatCheckboxModule, MatTooltipModule,
  MatSliderModule, MatSnackBarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from './services/auth.service';
import { SettingsService } from './services/settings.service';

import { CurriculumListComponent } from './components/curriculum-list/curriculum-list.component';
import { ExtractionComponent } from './components/extraction/extraction.component';
import { AppComponent } from './app.component';
import { FkFilterComponent } from './components/fk-filter/fk-filter.component';
import { DistributionComponent } from './components/distribution/distribution.component';
import { TeacherLoadComponent } from './components/teacher-load/teacher-load.component';
import { LoadKafComponent } from './components/load-kaf/load-kaf.component';
import { CourseWorksComponent } from './components/course-works/course-works.component';

import { GetNamePipe } from './pipes/get-name.pipe';
import { EducationYearPipe } from './pipes/education-year.pipe';
import { TeacherNamePipe } from './pipes/teacher-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DistributionComponent,
    FkFilterComponent,
    TeacherNamePipe,
    GetNamePipe,
    TeacherLoadComponent,
    CurriculumListComponent,
    ExtractionComponent,
    EducationYearPipe,
    LoadKafComponent,
    CourseWorksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatTableModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSliderModule,
    MatSnackBarModule
  ],
  entryComponents: [ CourseWorksComponent ],
  providers: [ AuthService, SettingsService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
