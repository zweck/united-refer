import { Injectable } from '@angular/core';

@Injectable()
export class Cache {
  public updateOfflineCache = () => {

  };

  public getCache = () => {
    return localStorage.getItem('cache') ? JSON.parse(localStorage.getItem('cache')) : {};
  };

  public getData = (key) => {
    var cache = JSON.parse(localStorage.getItem('cache'));
    return cache[key];
  };

  public setData = (key, data) => {
    var cache = this.getCache();
    cache[key] = data;
    localStorage.setItem('cache', JSON.stringify(cache));
  };

  public getLeads = () => {
    return JSON.parse(localStorage.getItem('leads')) ? JSON.parse(localStorage.getItem('leads')) : [];
  };

  public storeLeads = (leads) => {
    localStorage.setItem('leads', JSON.stringify(leads));
  };

  public storeLead = (lead) => {
    let leads = this.getLeads();
    leads.push(lead);
    this.storeLeads(leads);
  };

  public storeLea = (lead) => {
    var leads = this.getLeads();
    leads.push(lead);
    localStorage.setItem('leads', JSON.stringify(leads));
  }
}
