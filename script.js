/* =========================================================
   SILVIA & DAVID WEDDING INVITATION - INTERACTIVE LOGIC
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/TwyHQiNAUAUG1AUY8?g_st=aw";
  const WEDDING_DATE = new Date("2026-10-25T15:00:00+02:00"); // October 25, 2026 at 3:00 PM Cairo Time

  // 0. GENERATE AMBIENT FLOATING PETALS IN BACKGROUND
  const petalsContainer = document.getElementById("petalsContainer");
  if (petalsContainer) {
    const petalCount = 14;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("div");
      petal.classList.add("floating-petal");
      
      const size = Math.random() * 12 + 8; // 8px - 20px
      const leftPos = Math.random() * 100; // 0% - 100%
      const duration = Math.random() * 10 + 12; // 12s - 22s
      const delay = Math.random() * 15; // 0s - 15s

      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.3}px`;
      petal.style.left = `${leftPos}%`;
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      
      petalsContainer.appendChild(petal);
    }
  }

  // 1. GENERATE QR CODE FOR GOOGLE MAPS
  const qrcodeElement = document.getElementById("qrcode");
  if (qrcodeElement) {
    new QRCode(qrcodeElement, {
      text: GOOGLE_MAPS_URL,
      width: 115,
      height: 115,
      colorDark: "#430b14", // Luxury Deep Burgundy
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // 2. LIVE COUNTDOWN TIMER
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE.getTime() - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    } else {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 3. BACKGROUND MUSIC CONTROLLER & SYNCED LYRICS VISUALIZER
  const musicBtn = document.getElementById("musicToggleBtn");
  const audio = document.getElementById("weddingAudio");
  const audioWaves = document.getElementById("audioWaves");
  const lyricsFlankLeft = document.getElementById("lyricsFlankLeft");
  const lyricsFlankRight = document.getElementById("lyricsFlankRight");
  const leftLyricText = document.getElementById("leftLyricText");
  const rightLyricText = document.getElementById("rightLyricText");
  const liveLyricsRibbon = document.getElementById("liveLyricsRibbon");
  const ribbonLyricText = document.getElementById("ribbonLyricText");

  let isPlaying = false;
  let currentLyricIndex = -1;

  // Real-time Timed Lyrics for "Sway" by Michael Bublé (Shifted 1.8s earlier for comfortable reading)
  const SWAY_LYRICS = [
    { time: 0, left: "♫ (Intro Melody) ♫", right: "Silvia & David • 25 Oct 2026 💍", ribbon: "♫ Sway — Michael Bublé ♫" },
    { time: 12.5, left: "When marimba rhythms start to play...", right: "Dance with me, make me sway...", ribbon: "When marimba rhythms start to play... Dance with me, make me sway 💃" },
    { time: 20.2, left: "Like a lazy ocean hugs the shore...", right: "Hold me close, sway me more...", ribbon: "Like a lazy ocean hugs the shore... Hold me close, sway me more 🌊" },
    { time: 28.2, left: "Like a flower bending in the breeze...", right: "Bend with me, sway with ease...", ribbon: "Like a flower bending in the breeze... Bend with me, sway with ease 🌸" },
    { time: 36.2, left: "When we dance you have a way with me...", right: "Stay with me, sway with me...", ribbon: "When we dance you have a way with me... Stay with me, sway with me ✨" },
    { time: 44.2, left: "Other dancers may be on the floor...", right: "Dear, but my eyes will see only you...", ribbon: "Other dancers may be on the floor... but my eyes will see only you ❤️" },
    { time: 52.2, left: "Only you have that magic technique...", right: "When we sway I go weak...", ribbon: "Only you have that magic technique... When we sway I go weak 💫" },
    { time: 60.2, left: "I can hear the sounds of violins...", right: "Long before it begins...", ribbon: "I can hear the sounds of violins... Long before it begins 🎻" },
    { time: 68.2, left: "Make me thrill as only you know how...", right: "Sway me smooth, sway me now...", ribbon: "Make me thrill as only you know how... Sway me smooth, sway me now 💃" },
    { time: 76.2, left: "♫ (Sensational Horn Solo) ♫", right: "Celebrate Silvia & David!", ribbon: "♫ Celebrate love, unity, and a beautiful beginning ♫" },
    { time: 92.2, left: "Other dancers may be on the floor...", right: "Dear, but my eyes will see only you...", ribbon: "Other dancers may be on the floor... but my eyes will see only you ❤️" },
    { time: 100.2, left: "Only you have that magic technique...", right: "When we sway I go weak...", ribbon: "Only you have that magic technique... When we sway I go weak 💫" },
    { time: 108.2, left: "When we dance you have a way with me...", right: "Stay with me, sway with me...", ribbon: "Stay with me, sway with me... Sway me now! 💍✨" }
  ];

  if (musicBtn && audio) {
    musicBtn.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        musicBtn.classList.remove("playing");
        musicBtn.querySelector(".music-tooltip").textContent = "Play 'Sway' 💃🎶";
        if (audioWaves) audioWaves.classList.remove("active");
        if (lyricsFlankLeft) lyricsFlankLeft.classList.remove("active");
        if (lyricsFlankRight) lyricsFlankRight.classList.remove("active");
        if (liveLyricsRibbon) liveLyricsRibbon.classList.remove("playing");
        if (ribbonLyricText) ribbonLyricText.textContent = "Click play to listen to 'Sway' & watch lyrics";
        isPlaying = false;
      } else {
        audio.play().then(() => {
          musicBtn.classList.add("playing");
          musicBtn.querySelector(".music-tooltip").textContent = "Pause 'Sway' ⏸";
          if (audioWaves) audioWaves.classList.add("active");
          if (lyricsFlankLeft) lyricsFlankLeft.classList.add("active");
          if (lyricsFlankRight) lyricsFlankRight.classList.add("active");
          if (liveLyricsRibbon) liveLyricsRibbon.classList.add("playing");
          isPlaying = true;
          triggerGentleConfetti();
        }).catch(err => {
          console.error("Audio playback error:", err);
          audio.load();
          audio.play();
        });
      }
    });

    // Real-time Lyrics Synchronization
    audio.addEventListener("timeupdate", () => {
      if (!isPlaying) return;
      const currentTime = audio.currentTime;
      let matchedIndex = 0;

      for (let i = SWAY_LYRICS.length - 1; i >= 0; i--) {
        if (currentTime >= SWAY_LYRICS[i].time) {
          matchedIndex = i;
          break;
        }
      }

      if (matchedIndex !== currentLyricIndex) {
        currentLyricIndex = matchedIndex;
        const currentData = SWAY_LYRICS[matchedIndex];

        if (leftLyricText) {
          leftLyricText.textContent = currentData.left;
          leftLyricText.classList.remove("pop");
          void leftLyricText.offsetWidth; // trigger reflow
          leftLyricText.classList.add("pop");
        }

        if (rightLyricText) {
          rightLyricText.textContent = currentData.right;
          rightLyricText.classList.remove("pop");
          void rightLyricText.offsetWidth;
          rightLyricText.classList.add("pop");
        }

        if (ribbonLyricText) {
          ribbonLyricText.textContent = currentData.ribbon;
        }
      }
    });
  }

  // 4. ADD TO CALENDAR (.ICS & GOOGLE CALENDAR)
  const btnCalendar = document.getElementById("btnCalendar");
  if (btnCalendar) {
    btnCalendar.addEventListener("click", () => {
      // Event Details
      const title = encodeURIComponent("Silvia & David's Wedding Ceremony");
      const details = encodeURIComponent("Together in Holy Matrimony! Join us in celebrating Silvia Ayman and David Medhat at Archangel Michael Church, Sheraton.");
      const location = encodeURIComponent("Archangel Michael Coptic Orthodox Church, Sheraton, Cairo");
      
      // Google Calendar Date format: YYYYMMDDTHHMMSSZ (Cairo is UTC+2 -> 20261025T130000Z)
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261025T130000Z/20261025T160000Z&details=${details}&location=${location}`;

      // Open Google Calendar in new tab
      window.open(gcalUrl, "_blank");

      // Also trigger iCal download for iOS / Apple users
      downloadICSFile();
    });
  }

  function downloadICSFile() {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Silvia and David Wedding//EN",
      "BEGIN:VEVENT",
      "UID:silvia-david-wedding-2026",
      "DTSTAMP:20260911T000000Z",
      "DTSTART:20261025T130000Z",
      "DTEND:20261025T160000Z",
      "SUMMARY:Silvia & David's Wedding Ceremony",
      "DESCRIPTION:Together in Holy Matrimony! Join us in celebrating Silvia Ayman and David Medhat at Archangel Michael Church, Sheraton.",
      "LOCATION:Archangel Michael Coptic Orthodox Church, Sheraton, Cairo",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Silvia_and_David_Wedding.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 5. DOWNLOAD HIGH-RES INVITATION CARD (IMAGE EXPORT)
  const btnDownloadCard = document.getElementById("btnDownloadCard");
  const invitationCard = document.getElementById("invitationCard");

  if (btnDownloadCard && invitationCard) {
    btnDownloadCard.addEventListener("click", () => {
      const originalBtnText = btnDownloadCard.innerHTML;
      btnDownloadCard.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating High-Res Image...`;
      btnDownloadCard.disabled = true;

      // Small delay to ensure rendering
      setTimeout(() => {
        html2canvas(invitationCard, {
          scale: 3, // Ultra crisp resolution for printing and sharing
          useCORS: true,
          backgroundColor: "#fdfbf7",
          logging: false
        }).then(canvas => {
          const image = canvas.toDataURL("image/png", 1.0);
          const downloadLink = document.createElement("a");
          downloadLink.href = image;
          downloadLink.download = "Silvia_and_David_Wedding_Invitation.png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          btnDownloadCard.innerHTML = `<i class="fa-solid fa-check"></i> Downloaded Successfully!`;
          triggerGentleConfetti();

          setTimeout(() => {
            btnDownloadCard.innerHTML = originalBtnText;
            btnDownloadCard.disabled = false;
          }, 3000);
        }).catch(err => {
          console.error("Card generation failed:", err);
          btnDownloadCard.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Error Downloading`;
          setTimeout(() => {
            btnDownloadCard.innerHTML = originalBtnText;
            btnDownloadCard.disabled = false;
          }, 2500);
        });
      }, 300);
    });
  }

  // 6. WHATSAPP SHARING (Universal wa.me link)
  const btnShareWhatsApp = document.getElementById("btnShareWhatsApp");
  if (btnShareWhatsApp) {
    const rawMessage = 
`💍 Wedding Invitation | Silvia & David

Together with joyful hearts and the blessings of God, we invite you to celebrate the holy matrimony of Silvia Ayman & David Medhat! ✨

📅 Date: Sunday, October 25, 2026
⏰ Time: 3:00 PM
📍 Venue: Archangel Michael Church, Sheraton
🗺 Location: ${GOOGLE_MAPS_URL}

We can't wait to celebrate with you!`;

    const encodedMessage = encodeURIComponent(rawMessage);
    // Universal WhatsApp API endpoint (works on iOS, Android, and Desktop WhatsApp Web)
    btnShareWhatsApp.href = `https://wa.me/?text=${encodedMessage}`;
    
    // Also attach click listener as fallback
    btnShareWhatsApp.addEventListener("click", (e) => {
      // Direct navigation handled by anchor tag
      triggerGentleConfetti();
    });
  }

  // 7. CELEBRATION CONFETTI EFFECT
  function triggerGentleConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c79a45', '#5f111e', '#f3e0b8', '#9e2b40']
      });
    }
  }
});
