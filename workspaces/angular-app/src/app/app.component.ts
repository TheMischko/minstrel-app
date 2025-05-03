import { Component, inject, OnInit } from "@angular/core";
import { MenuBarComponent } from "./modules/menu-bar/menu-bar.component";
import { SideBarComponent } from "./modules/side-bar/side-bar.component";
import { RouterOutlet } from "@angular/router";
import { PlaybackStore } from "./store/playback.store";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [MenuBarComponent, SideBarComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  title = "electron-angular-quick-start";
  playbackStore = inject(PlaybackStore);

  ngOnInit() {
    this.playbackStore.playSingle({
      url: "/assets/test-track.mp3",
      name: "Dream Walk",
    });
  }
}
