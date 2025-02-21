import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'csspractice1';
  @ViewChild('slider') slider: ElementRef<HTMLElement> | null = null;
  @ViewChildren('card') cards: QueryList<ElementRef> | null = null;

  images: string[] = [
    'https://images.unsplash.com/photo-1626593261859-4fe4865d8cb1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1594568284297-7c64464062b1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1701767501250-fda0c8f7907f?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1559511331-6a3a4e72f588?q=80&w=3047&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',    
    'https://images.unsplash.com/photo-1603486002664-a7319421e133?q=80&w=3042&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1701693533885-f3eb90a05912?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ];

  currPosition = 0;

  startX = 0;
  playAnimation = true;
  mousedown = false;

  ngAfterViewInit() {

    this.animation();
    document.addEventListener('mousedown', (e)=> {
      if(!this.isMouseEventInClientArea(e, this.slider?.nativeElement!)) {
        return
      }
      this.playAnimation = false;
      this.mousedown = true;
      this.startX = e.clientX;
    })
    document.addEventListener('mousemove', (e)=> {
      if(this.mousedown) {
        var dx = (e.clientX - this.startX)
        this.currPosition += dx*0.2;
        this.startX = e.clientX;
      }
    })
    document.addEventListener('mouseup', ()=> {
      this.mousedown = false;
      setTimeout(()=> {
        this.playAnimation = true;
      }, 2000)
      
    })
  }

  scale(oldValue: number, oldMin: number, oldMax: number, newMin: number, newMax: number) :number {
    return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin
  }

  animation() {
    setTimeout(()=> {
      if(this.playAnimation) {
        this.currPosition = this.currPosition + 0.05;
      }
      this.updateCards();
      this.animation();
    }, 20)
  }

  updateCards() {
    var numCards = this.cards?.length ? this.cards?.length : 0;
    for(let i = 0; i<numCards; i++) {
      var val = i/numCards;
      var offset = this.scale(val, 0, 1, -70, 70)

      if(this.currPosition+offset > 70) {
        this.images.unshift(this.images.pop()!)
        this.currPosition = 0;
      }
      else if(this.currPosition+offset < -70) { 
        this.images.push(this.images.shift()!)
        this.currPosition = 23;
      }
      var parallax = this.scale(this.currPosition + offset, -70, 70, -50, 150)
      this.cards!.get(i)!.nativeElement.style.transform = `translateY(-50%) translateX(-50%) rotateY(${this.currPosition + offset}deg) translateZ(9cm) rotateX(-15deg)`;
      this.cards!.get(i)!.nativeElement.firstChild.style.objectPosition = `${parallax}% 0%`
    }
  }

  isMouseEventInClientArea(event:any, element: HTMLElement)
  {
    var rect = element!.getBoundingClientRect();
    var minX = rect.left + element!.clientLeft;
    var x = event.clientX;
    if (x < minX || x >= minX + element!.clientWidth) return false;
    var minY = rect.top + element!.clientTop;
    var y = event.clientY;
    if (y < minY || y >= minY + element!.clientHeight) return false;
    return true;
  }
}
