import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
  Input
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ExtractionComponent } from '../extraction/extraction.component';

import { CurriculumService } from '../../services/curriculum.service';
import { AuthService } from '../../services/auth.service';

import { CurriculumList } from '../../models/curriculum';
import { DepartmentInfo } from '../../models/common';

@Component({
  selector: 'app-curriculum-list',
  templateUrl: './curriculum-list.component.html',
  styleUrls: ['./curriculum-list.component.css'],
  providers: [ CurriculumService ],
  entryComponents: [ ExtractionComponent ]
})
export class CurriculumListComponent implements OnInit {

  @Output() cmpName: any = 'Иқтибосҳо';
  @Input() depInfo: DepartmentInfo;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('curriculum', {read: ViewContainerRef}) parent: ViewContainerRef;
  @ViewChild('filter') filterInput: ElementRef;

  cmpRef: ComponentRef<ExtractionComponent>;
  myControl: FormControl = new FormControl();

  curriculumDatabase: CurriculumService | null;
  dataSource: CurriculumDataSource | null;

  displayedColumns = ['number', 'speciality', 'course', 'degree',
    'type', 'educationYear', 'dateOfStandard', 'actions'];
  curriculumList: CurriculumList;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private auth: AuthService,
              public  httpClient: HttpClient) {
  }

  ngOnInit() {
    this.setStToDefault();
    this.loadData();
  }

  setStToDefault() {
    this.curriculumList = {
      id: null,
      number: null,
      idSpec: null,
      speciality: null,
      degree: null,
      type: null,
      course: null,
      educationYear: null,
      idStandard: null,
      dateOfStandard: null,
      locked: 0
    };
  }

  openSt(row: CurriculumList) {
    if (this.cmpRef) { this.cmpRef.destroy(); }

    const childComponent = this.componentFactoryResolver.resolveComponentFactory(ExtractionComponent);
    const CmpRef = this.parent.createComponent(childComponent);

    CmpRef.instance.Curriculum = {
      id: row.id,
      number: row.number,
      idSpec: row.idSpec,
      speciality: row.speciality,
      degree: row.degree,
      type: row.type,
      course: +row.course,
      educationYear: row.educationYear,
      idStandard: row.idStandard,
      dateOfStandard: row.dateOfStandard,
      locked: row.locked
    };

    this.cmpRef = CmpRef;
  }

  public loadData() {
    this.curriculumDatabase = new CurriculumService(this.httpClient, this.auth);
    this.dataSource = new CurriculumDataSource(this.curriculumDatabase, this.paginator, this.sort, this.depInfo.fcId);
    fromEvent(this.filterInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged())
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filterInput.nativeElement.value;
      });
  }
}

export class CurriculumDataSource extends DataSource<CurriculumList> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: CurriculumList[] = [];
  renderedData: CurriculumList[] = [];

  constructor(public _exampleDatabase: CurriculumService,
              public _paginator: MatPaginator,
              public _sort: MatSort,
              public kf_id: number) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<CurriculumList[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllCurriculums(this.kf_id);

    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: CurriculumList) => {
        const searchStr = (issue.id + issue.number + issue.speciality + issue.course + issue.educationYear).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    }));
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: CurriculumList[]): CurriculumList[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'number': [propertyA, propertyB] = [a.number, b.number]; break;
        case 'speciality': [propertyA, propertyB] = [a.speciality, b.speciality]; break;
        case 'course': [propertyA, propertyB] = [a.course, b.course]; break;
        case 'educationYear': [propertyA, propertyB] = [a.educationYear, b.educationYear]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
