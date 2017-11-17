import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isOpen: boolean;

  constructor() { }

  ngOnInit() {
    this.isOpen = false;
  }

  navClick() {
    this.isOpen = !this.isOpen;
    const btn = document.getElementById('nav-btn');
    const nav = document.getElementById('nav-main');
    btn.classList.toggle('open');
    nav.classList.toggle('open');
  }
}
