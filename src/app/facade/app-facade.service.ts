import { Injectable } from '@angular/core';
import { NewsApiService } from '../api/news-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { News } from '../model/news';

@Injectable({
  providedIn: 'root'
})
export class AppFacadeService {
  get latestNews(): Observable<News[]> {
    return this.newsApiService.fetchNews();
  }

  getNewsFromAuthor(authorName: string): Observable<News[]> {
    return this.newsApiService
      .fetchNews()
      .pipe(map(news => news.filter(n => n.author === authorName)));
  }

  connect(): Observable<News> {
    return this.newsApiService.connectToNewsStream();
  }

  constructor(private newsApiService: NewsApiService) {}
}
