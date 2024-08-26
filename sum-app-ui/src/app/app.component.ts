import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SumComponent } from './components/sum/sum.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SumComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'jitterbit-test';
}
