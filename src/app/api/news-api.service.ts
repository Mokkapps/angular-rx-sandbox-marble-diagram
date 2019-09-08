import { Injectable } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';
import { News } from '../model/news';

export const testData: News[] = [
  {
    author: 'Mike',
    title: 'New Xbox revealed',
    date: new Date('2019-09-11')
  },
  {
    author: 'Florian',
    title: 'Halo X Review',
    date: new Date('2019-05-12')
  },
  {
    author: 'Chris',
    title: 'Overwatch 5 announced',
    date: new Date('2019-12-12')
  }
];

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  // Simulates an HTTP request to a backend
  fetchNews(): Observable<News[]> {
    return of(testData).pipe(delay(1000));
  }

  // Simulates a socket connection which emits news
  connectToNewsStream(): Observable<News> {
    return interval(2000).pipe(
      take(testData.length),
      map(i => testData[i])
    );
  }
}
