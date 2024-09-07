import { TestBed } from '@angular/core/testing';

import { SongLibraryService } from './song-library.service';

describe('SongLibraryService', () => {
  let service: SongLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
