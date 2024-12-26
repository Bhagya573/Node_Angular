import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Quote Creation App';
  currentLanguage: string = 'en';

  constructor(private translate: TranslateService) {
    // Setting default language
    this.translate.setDefaultLang('en');

    // Fetching language preference from localStorage or default to English
    const lang = localStorage.getItem('lang') || 'en';
    this.translate.use(lang); 
    this.currentLanguage = lang; 
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLanguage = lang; 
    localStorage.setItem('lang', lang);
  }
}
