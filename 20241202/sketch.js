let angle = 0;
let fontSize = 48;
let glowAmount = 0;
let textColor;
let fireworks = [];

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  textSize(fontSize);
  textColor = color(100, 150, 255);
}

function draw() {
  background(35, 35, 50, 25);
  
  // 更新和顯示煙火
  updateFireworks();
  
  // 繪製動態背景
  drawBackground();
  
  // 更新發光效果
  glowAmount = 15 + sin(frameCount * 0.05) * 5;
  
  // 更新文字顏色
  let hue = map(sin(frameCount * 0.02), -1, 1, 180, 240);
  textColor = color(hue, 80, 100);
  
  // 繪製主標題
  drawText("淡江大學", 0, -50);
  
  // 繪製副標題
  drawText("教育科技學系", 0, 10);
  
  // 繪製學號姓名
  push();
  textSize(fontSize * 0.6); // 將字體大小設為主標題的 0.6 倍
  drawText("413730226陳筱詩", 0, 60);
  pop();
  
  // 隨機產生新煙火
  if (random(1) < 0.03) {
    fireworks.push(new Firework());
  }
}

class Firework {
  constructor() {
    this.x = random(width);
    this.y = height;
    this.targetY = random(height/4, height * 0.6);
    this.vel = -random(8, 12);
    this.particles = [];
    this.exploded = false;
    this.color = color(random(150, 255), random(150, 255), random(150, 255));
  }
  
  update() {
    if (!this.exploded) {
      this.y += this.vel;
      
      if (this.y <= this.targetY) {
        this.explode();
      }
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.update();
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  explode() {
    this.exploded = true;
    for (let i = 0; i < 50; i++) {
      let angle = random(TWO_PI);
      let speed = random(2, 6);
      this.particles.push(new Particle(
        this.x,
        this.y,
        cos(angle) * speed,
        sin(angle) * speed,
        this.color
      ));
    }
  }
  
  display() {
    if (!this.exploded) {
      stroke(this.color);
      strokeWeight(4);
      point(this.x, this.y);
    }
    
    for (let p of this.particles) {
      p.display();
    }
  }
  
  isDead() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = 255;
    this.gravity = 0.1;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= 5;
  }
  
  display() {
    if (this.life > 0) {
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = this.color;
      stroke(red(this.color), green(this.color), blue(this.color), this.life);
      strokeWeight(2);
      point(this.x, this.y);
    }
  }
}

function updateFireworks() {
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    if (fireworks[i].isDead()) {
      fireworks.splice(i, 1);
    }
  }
}

function drawBackground() {
  // 繪製動態波紋
  noFill();
  for (let i = 0; i < 5; i++) {
    let alpha = map(i, 0, 4, 50, 10);
    stroke(100, 150, 255, alpha);
    let size = 200 + i * 50 + sin(frameCount * 0.02 + i) * 20;
    circle(width/2, height/2, size);
  }
  
  // 繪製背景粒子
  for (let i = 0; i < 50; i++) {
    let x = noise(i * 0.1, frameCount * 0.01) * width;
    let y = noise(i * 0.1, frameCount * 0.01 + 1000) * height;
    let size = noise(i * 0.1, frameCount * 0.01 + 2000) * 3;
    
    fill(200, 220, 255, 100);
    noStroke();
    circle(x, y, size);
  }
}

function drawText(txt, offsetX, offsetY) {
  push();
  translate(width/2 + offsetX, height/2 + offsetY);
  
  // 添加輕微搖擺
  let wobble = sin(frameCount * 0.05) * 2;
  rotate(radians(wobble));
  
  // 繪製發光效果
  drawingContext.shadowBlur = glowAmount;
  drawingContext.shadowColor = color(100, 200, 255);
  
  // 繪製文字邊框
  strokeWeight(2);
  stroke(textColor);
  fill(35, 35, 50);
  text(txt, 0, 0);
  
  // 繪製實心文字
  noStroke();
  fill(textColor);
  text(txt, 0, 0);
  
  pop();
}

function mousePressed() {
  // 點擊時在滑鼠位置產生煙火
  fireworks.push(new Firework());
  // 改變文字顏色
  textColor = color(random(150, 255), random(150, 255), 255);
}
