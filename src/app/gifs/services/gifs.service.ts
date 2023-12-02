import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';
import { delay } from 'rxjs';

@Injectable({providedIn: 'root'})
export class GifsService {

  private apiKey: string = 'GTUDkZ8qpQ4MZzA0BCcGqvGBWRCnaYsN';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';
  private _tagsHistory: string[] = [];

  public gifsList: Gif[] = [];

  constructor(
    private http: HttpClient
  ) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  public searchTag( tag: string ): void {

    if(tag.length === 0 ) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag)

    this.http.get<SearchResponse>(`${ this.serviceUrl}/search`,{ params })
    .subscribe(
      resp => {
        this.gifsList = resp.data;
      }
    )

  }

  private organizeHistory( tag: string ) {
    tag = tag.toLowerCase();

    if(this.tagsHistory.includes(tag)) {
      this._tagsHistory = this.tagsHistory.filter(oldTag => oldTag != tag)
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();



  }


  private saveLocalStorage(): void {
    localStorage.setItem('history',JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    const temporal = localStorage.getItem('history');
    if(temporal == null ) return;

    this._tagsHistory = JSON.parse(temporal);

    this.searchTag(this._tagsHistory[0]);

  }


}
