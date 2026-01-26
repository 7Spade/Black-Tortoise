import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-team-create-trigger',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './team-create-trigger.html',
  styleUrls: ['./team-create-trigger.scss']
})
export class TeamCreateTriggerComponent {}
