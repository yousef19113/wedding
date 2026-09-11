/* =========================================================
   SILVIA & DAVID WEDDING INVITATION - INTERACTIVE LOGIC
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/TwyHQiNAUAUG1AUY8?g_st=aw";
  const WEDDING_DATE = new Date("2026-10-25T15:00:00+02:00"); // October 25, 2026 at 3:00 PM Cairo Time

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

  // 3. BACKGROUND MUSIC CONTROLLER
  const musicBtn = document.getElementById("musicToggleBtn");
  const audio = document.getElementById("weddingAudio");
  let isPlaying = false;

  if (musicBtn && audio) {
    musicBtn.addEventListener("click", () => {
      if (isPlaying) {
        audio.pause();
        musicBtn.classList.remove("playing");
        musicBtn.querySelector(".music-tooltip").textContent = "Play Music 🎵";
        isPlaying = false;
      } else {
        audio.play().then(() => {
          musicBtn.classList.add("playing");
          musicBtn.querySelector(".music-tooltip").textContent = "Pause Music ⏸";
          isPlaying = true;
          triggerGentleConfetti();
        }).catch(err => {
          console.log("Audio playback error:", err);
        });
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
