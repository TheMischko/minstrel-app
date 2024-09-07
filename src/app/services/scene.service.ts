import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SceneService {
  scenes = new BehaviorSubject<Scene[]>([]);

  listenToAllScenes(): Observable<Scene[]> {
    return this.scenes.asObservable();
  }

  addScene(scene: Scene): void {
    const oldVal = this.scenes.value;
    this.scenes.next([...oldVal, scene]);
  }
}

type Scene = string;
