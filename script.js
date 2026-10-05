const birthDate = new Date(2008, 9, 18, 0, 0, 0);

document.addEventListener('DOMContentLoaded', () => {
  initThreeBackground();
  startLiveCounter();
  spawnFloatingHearts();
  renderTextHeartAnimation();
  setupInteractions();
  setupClickSparks();
});

function setupClickSparks() {
  const card = document.getElementById('cardContainer');
  const emojis = ['💖', '✨', '🌸', '💫'];

  card.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
      const spark = document.createElement('div');
      spark.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      spark.style.position = 'fixed';
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      spark.style.pointerEvents = 'none';
      spark.style.fontSize = '1.2rem';
      spark.style.zIndex = '200';
      document.body.appendChild(spark);

      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 40;

      gsap.to(spark, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0.3,
        duration: 0.8,
        onComplete: () => spark.remove()
      });
    }
  });
}

function renderTextHeartAnimation() {
  const ui = document.getElementById('textHeartUI');
  ui.innerHTML = '';
  const totalItems = 44; 

  for (let i = 1; i <= totalItems; i++) {
    const love = document.createElement("div");
    love.className = "love";
    
    const t = (i / totalItems) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3) * 7.2;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * 7.2;

    love.style.transform = `translate(${x}px, ${y}px)`;
    love.innerHTML = `<div class="love_word">I love you</div>`;

    ui.appendChild(love);
  }
}

function typeLoveText(callback) {
  const textContainer = document.getElementById('loveTextWrapper');
  const textElement = document.getElementById('loveText');
  const fullText = "I Love You";
  let index = 0;

  gsap.to(textContainer, { opacity: 1, duration: 0.3 });

  function typeChar() {
    if (index < fullText.length) {
      textElement.innerHTML += fullText.charAt(index);
      index++;
      setTimeout(typeChar, 120);
    } else {
      setTimeout(() => {
        gsap.to(textContainer, {
          opacity: 0,
          scale: 1.2,
          duration: 0.6,
          onComplete: callback
        });
      }, 1000);
    }
  }

  typeChar();
}

function spawnFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  const emojis = ['💖', '💕', '💗', '💓', '✨', '🌸'];

  setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'float-heart';
    heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${4 + Math.random() * 4}s`;
    heart.style.fontSize = `${1 + Math.random() * 1.5}rem`;

    container.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
  }, 350);
}

let scene, camera, renderer, particles;

function initThreeBackground() {
  const canvas = document.getElementById('bgCanvas');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.BufferGeometry();
  const count = 500;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 16;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.035,
    color: 0xff416c,
    transparent: true,
    opacity: 0.75
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0012;
    particles.rotation.x += 0.0006;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function startLiveCounter() {
  function update() {
    const now = new Date();
    const diff = now - birthDate;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('y').innerText = years;
    document.getElementById('d').innerText = days;
    document.getElementById('h').innerText = hours;
    document.getElementById('m').innerText = minutes;
    document.getElementById('s').innerText = seconds;
  }
  update();
  setInterval(update, 1000);
}

function setupInteractions() {
  const btn = document.getElementById('launchBtn');
  const candle = document.getElementById('candle');
  const bgAudio = document.getElementById('bgAudio');

  btn.addEventListener('click', () => {
    // محاولة تشغيل الصوت من ملف الصوت 
    if (bgAudio) {
      bgAudio.currentTime = 0;
      bgAudio.play().then(() => {
        console.log("Audio playing successfully!");
      }).catch(err => {
        console.log("Audio play error:", err);
        // في حال كان اسم الصوت song.mp3 في المجلد الرئيسي
        bgAudio.src = "song.mp3";
        bgAudio.play().catch(e => console.log("Secondary play error:", e));
      });
    }

    btn.style.pointerEvents = 'none';
    gsap.to(btn, { opacity: 0, scale: 0.9, duration: 0.3 });
    document.getElementById('hintText').innerText = "جاري كتابة المفاجأة... 💖";

    const tl = gsap.timeline();

    tl.to("#bow", { scaleX: 0.7, duration: 0.3, ease: "power2.inOut" })
      .to("#arrow", { y: -220, duration: 0.35, ease: "power3.in" })
      .to("#heartTarget", {
        scale: 2.2,
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          createExplosion();
          typeLoveText(() => {
            gsap.to("#cakeContainer", {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.85,
              ease: "elastic.out(1, 0.5)"
            });
            document.getElementById('hintText').innerText = "اضغط على الشمعة لإطفائها 🕯️";
            fireMultipleConfetti();
          });
        }
      }, "-=0.05")
      .to(".sound-wave", { opacity: 0, duration: 0.2 }, "-=0.2")
      .to("#bow", { opacity: 0, duration: 0.2 }, "-=0.2");
  });

  candle.addEventListener('click', () => {
    const flame = document.getElementById('flame');
    if (flame.style.display !== 'none') {
      flame.style.display = 'none';
      fireMultipleConfetti();
      document.getElementById('hintText').innerText = "تم إطفاء الشمعة! كل عام وأنت بخير 🎉✨";
    }
  });
}

function createExplosion() {
  const heart = document.getElementById('heartTarget');
  const rect = heart.getBoundingClientRect();
  const emojis = ['💖', '💕', '💗', '💓', '✨', '🌸'];

  for (let i = 0; i < 45; i++) {
    const el = document.createElement('div');
    el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.position = 'fixed';
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top = `${rect.top + rect.height / 2}px`;
    el.style.pointerEvents = 'none';
    el.style.zIndex = '100';
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 130;

    gsap.to(el, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      scale: 0.2,
      rotation: Math.random() * 360,
      duration: 1.3,
      ease: "power2.out",
      onComplete: () => el.remove()
    });
  }
}

function fireMultipleConfetti() {
  const count = 220;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}