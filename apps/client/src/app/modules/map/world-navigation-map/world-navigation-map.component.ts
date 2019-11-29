import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationObjective } from '../navigation-objective';
import { MapService } from '../map.service';
import { NavigationStep } from '../navigation-step';
import { Observable } from 'rxjs/Observable';
import { Vector2 } from '../../../core/tools/vector2';
import { MapData } from '../map-data';
import { first, tap } from 'rxjs/operators';
import { WorldNavigationStep } from '../world-navigation-step';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-world-navigation-map',
  templateUrl: './world-navigation-map.component.html',
  styleUrls: ['./world-navigation-map.component.less']
})
export class WorldNavigationMapComponent implements OnInit {

  @Input()
  points: NavigationObjective[] = [];

  optimizedPath$: Observable<WorldNavigationStep[]>;

  public containerRef: ElementRef;

  @ViewChild('container')
  public set _containerRef(ref: ElementRef) {
    setTimeout(() => {
      this.containerRef = ref;
    });
  }

  public currentPath: WorldNavigationStep;

  markedAsDone = [];

  public markAsDone$: Subject<NavigationStep> = new Subject<NavigationStep>();

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.optimizedPath$ = this.mapService.getOptimizedPathInWorld(this.points).pipe(
      first(),
      tap(path => {
        this.currentPath = path[0];
      })
    );
  }

  getPositionPercent(map: MapData, coords: Vector2): Vector2 {
    const positionPercents = this.mapService.getPositionOnMap(map, coords);
    return {
      x: positionPercents.x * this.containerRef.nativeElement.offsetWidth / 100,
      y: positionPercents.y * this.containerRef.nativeElement.offsetHeight / 100
    };
  }

  markStepAsDone(step: NavigationStep): void {
    this.markedAsDone.push(step);
    this.markAsDone$.next(step);
  }

}
