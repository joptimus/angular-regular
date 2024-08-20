import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  signature;
  constructor() { }

  reload = false;
}
