import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.css']
})
export class WikiComponent {
  constructor(
    private _route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
  }
}
