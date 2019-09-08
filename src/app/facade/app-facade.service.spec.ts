import { rxSandbox } from 'rx-sandbox';
const { marbleAssert } = rxSandbox;

import { AppFacadeService } from './app-facade.service';
import { testData } from '../api/news-api.service';

describe('AppFacadeService', () => {
  let sut: AppFacadeService;
  let newsApiService: any;
  let rx: any;

  beforeEach(() => {
    // we need to create a  sandbox for each test run
    rx = rxSandbox.create();
    const { cold, hot } = rx;

    // we mock the API service and return mocked observables which are created by marble strings
    newsApiService = jasmine.createSpyObj('NewsApiService', [
      'fetchNews',
      'connectToNewsStream'
    ]);
    newsApiService.fetchNews.and.returnValue(
      cold('a', {
        a: testData
      })
    );
    newsApiService.connectToNewsStream.and.returnValue(
      hot('a-^-a-b-c|', {
        a: testData[0],
        b: testData[1],
        c: testData[2]
      })
    );

    // we create a new instance of the service and pass the mock service to its constructor
    sut = new AppFacadeService(newsApiService);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  it('should return latest news', () => {
    const { e, getMessages, flush } = rx;

    // create the expected observable by using marble string
    const expectedObservable = e('a', {
      a: testData
    });

    // get metadata from observable to assert with expected metadata values
    const messages = getMessages(sut.latestNews);

    // execute observables
    flush();

    // When assertion fails, 'marbleAssert' will display visual / object diff with raw object values for easier debugging.
    marbleAssert(messages).to.equal(expectedObservable);
  });

  it('should fail if news cannot be fetched', () => {
    const { cold, e, getMessages, flush } = rx;
    newsApiService.fetchNews.and.returnValue(cold('#'));
    sut = new AppFacadeService(newsApiService);

    const expectedObservable = e('#', {
      a: testData
    });

    const messages = getMessages(sut.latestNews);

    // execute observables
    flush();

    marbleAssert(messages).to.equal(expectedObservable);
  });

  it('should return news from author', () => {
    const { e, getMessages, flush } = rx;
    const expectedObservable = e('a', {
      a: [testData[0]]
    });

    const messages = getMessages(sut.getNewsFromAuthor('Mike'));

    // execute observables
    flush();

    marbleAssert(messages).to.equal(expectedObservable);
  });

  it('should return news from stream', () => {
    const { e, getMessages, flush } = rx;
    const expectedObservable = e('--a-b---c|', {
      a: testData[0],
      b: testData[1],
      c: testData[2]
    });

    const messages = getMessages(sut.connect());

    // execute observables
    flush();

    marbleAssert(messages).to.equal(expectedObservable);
  });
});
