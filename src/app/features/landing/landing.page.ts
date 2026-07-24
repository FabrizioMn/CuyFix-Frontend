import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

declare var VANTA: any;

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
})
export class LandingPage implements OnInit, OnDestroy {
  private vantaEffect: any;

  ngOnInit(): void {
    this.initVanta();
  }

  initVanta(): void {
    try {
      if (typeof VANTA !== 'undefined') {
        this.vantaEffect = VANTA.CELLS({
          el: '#vanta-background',
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          color1: 0x0,
          color2: 0x17012a,
          size: 4.5,
          speed: 0.7,
        });
      }
    } catch (error) {
      console.error('No se pudo cargar el efecto Vanta:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
}
