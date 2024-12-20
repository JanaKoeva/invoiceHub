import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title(title: any) {
    throw new Error('Method not implemented.');
  }
}
