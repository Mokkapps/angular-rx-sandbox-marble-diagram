import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppFacadeService } from './facade/app-facade.service';
import { News } from './model/news';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'rx-sandbox-demo';

  latestNew$ = this.appFacade.latestNews;
  newsFromAuthor$ = this.appFacade.getNewsFromAuthor('Mike');

  private news: News[] = [];
  private subscription?: Subscription;

  constructor(private appFacade: AppFacadeService) {}

  ngOnInit(): void {
    this.subscription = this.appFacade
      .connect()
      .subscribe(news => this.news.push(news));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
