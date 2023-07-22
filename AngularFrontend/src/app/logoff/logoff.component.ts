import { Component } from '@angular/core';
import { HttpService } from "../http.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-logoff',
  templateUrl: './logoff.component.html',
  styleUrls: ['./logoff.component.css']
})
export class LogoffComponent {
  constructor(
    private _httpService: HttpService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this._httpService.logoffUser().subscribe(() => {
      this._router.navigate(['.']).then(() => {
      });
    });
  }
}
