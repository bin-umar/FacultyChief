import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SettingsService } from './services/settings.service';

import { DepartmentInfo, UserInfo } from './models/common';

import { TeacherLoadComponent } from './components/teacher-load/teacher-load.component';
import { CurriculumListComponent } from './components/curriculum-list/curriculum-list.component';
import { LoadKafComponent } from './components/load-kaf/load-kaf.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [
    TeacherLoadComponent,
    CurriculumListComponent,
    LoadKafComponent
  ]
})

export class AppComponent implements OnDestroy {
  @ViewChild('content', {read: ViewContainerRef})
      parent: ViewContainerRef;

  type: Type<CurriculumListComponent>;
  cmpRef: ComponentRef<CurriculumListComponent>;
  depInfo: DepartmentInfo;

  component = '';
  teacherComponent = TeacherLoadComponent;
  curriculumListComponent = CurriculumListComponent;
  loadKafCmp = LoadKafComponent;

  constructor (private componentFactoryResolver: ComponentFactoryResolver,
               private auth: AuthService,
               private stService: SettingsService) {

    const href = window.location.href;
    if (href.indexOf('hash') !== -1) {
      const hash = href.split('hash=')[1];
      const data = atob(hash).split('$');

      console.log(href);

      const user: UserInfo = {
        userId: +data[0],
        type: data[1],
        time: data[2]
      };

      this.auth.checkUserSession(user).subscribe(response => {
        if (!response) {
          window.location.replace('./error.html');
        } else {
          this.auth.getUserKafedra().subscribe(resp => {
            if (!resp.error) {

              this.auth.getDepartmentInfo(resp.data.id).subscribe(resp2 => {
                if (!resp2.error) {
                  this.depInfo = resp2.data;
                  this.stService.getLoadCoefficients();
                  this.stService.getKafedraByFacultyId(this.depInfo.fcId);
                }
              });
            }
          });
        }
      });
    } else {
      window.location.replace('./error.html');
    }

    // this.auth.getToken('jaxa', 'jaxa97').subscribe(result => {
    //   if (result) {
    //   } else {
    //     console.log('Username or password is incorrect');
    //   }
    // });
  }

  ngOnDestroy() {
    this.auth.logout();
  }

  createComponentDynamically(cmp) {
    if (this.cmpRef) { this.cmpRef.destroy(); }
    this.type = cmp;

    const childComponent = this.componentFactoryResolver.resolveComponentFactory(this.type);
    const CmpRef = this.parent.createComponent(childComponent);
    CmpRef.instance.depInfo = this.depInfo;
    this.component = CmpRef.instance.cmpName;

    this.cmpRef = CmpRef;
  }
}
