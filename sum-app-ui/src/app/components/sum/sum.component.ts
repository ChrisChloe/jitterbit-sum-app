import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SumOperationService } from '../../services/sum-operation/sum-operation.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog/dialog.component';
import { NumberDirective } from '../../directives/numbers-only.directive';

@Component({
  selector: 'app-sum',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    NumberDirective
  ],
  templateUrl: './sum.component.html',
  styleUrl: './sum.component.scss',
})
export class SumComponent {
  constructor(
    public sumOperationService: SumOperationService,
    public dialog: MatDialog
  ) {}

  number1 = new FormControl();
  number2 = new FormControl();

  sumId = new FormControl('');

  openDialog(
    title: string,
    type: string,
    sumId?: 'string',
    sumObject?: any
  ): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: { title, type, sumId, sumObject },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  sendNumbers() {
    this.sumOperationService
      .sendSumData(this.number1.value, this.number2.value)
      .subscribe(
        (response) => {
          console.log(response.insertedId);
          this.openDialog('Sum Id to check result', 'id', response.insertedId);
        },
        (error) => {
          console.error('sendSumData Error: ' + error);
        }
      );
  }

  getSumInfo() {
    this.sumOperationService.findSumById(this.sumId.value).subscribe(
      (response) => {
        this.openDialog('Sum Result', 'result', undefined, response);
        console.log(response);
      },
      (error) => {
        console.error('findSumById Error: ' + error);
      }
    );
  }
}
