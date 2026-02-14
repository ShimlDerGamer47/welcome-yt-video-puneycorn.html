document.addEventListener("DOMContentLoaded", () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const client = new StreamerbotClient({
      host: params.get("host") || "127.0.0.1",
      port: parseInt(params.get("port") || 8080, 10),
      endpoint: params.get("endpoint") || "/",
      password: params.get("password") || "",
      autoReconnect: true,
      immediate: true,
      onConnect: () => {
        console.log("Streamer.bot verbunden!");
      },
      onDisconnect: () => {
        console.warn("Streamer.bot getrennt - versuche Reconnect...");
      },
      onError: () => {
        console.error("Streamer.bot Verbindungsfehler!");
      },
    });

    const videoId = params.get("videoId") || "";
    const videoTitle = params.get("videoTitle") || "";
    const videoDuration = parseInt(params.get("videoDuration") || "0", 10);
    const videoImgDuration = parseInt(
      params.get("videoImgDuration") || "0",
      10,
    );

    let autoplay = true;
    let muted = false;
    let controls = true;
    let loop = false;

    if (params.has("autoplay")) {
      const v = (params.get("autoplay") || "").toLowerCase();
      autoplay = v === "true" || v === "1";
    }

    if (params.has("muted")) {
      const v = (params.get("muted") || "").toLowerCase();
      muted = v === "true" || v === "1";
    }

    if (params.has("controls")) {
      const v = (params.get("controls") || "").toLowerCase();
      controls = v === "true" || v === "1";
    }

    if (params.has("loop")) {
      const v = (params.get("loop") || "").toLowerCase();
      loop = v === "true" || v === "1";
    }

    const html = document.documentElement;
    const head = document.head;
    const body = document.body;

    const fontFamilyVar = "--font-family-var";
    const robotoBold = getComputedStyle(html)
      .getPropertyValue(fontFamilyVar)
      .trim();

    const copy = "copy";
    const dragstart = "dragstart";
    const keydown = "keydown";
    const select = "select";

    const none = "none";
    const def = "default";

    (function bodyToken() {
      const eventArray = [copy, dragstart, keydown, select];

      eventArray.forEach((event) => {
        if (!event) return;
        body.addEventListener(event, (e) => e.preventDefault());
      });

      if (robotoBold) {
        Object.assign(body.style, {
          fontFamily: robotoBold,
          webkitUserSelect: none,
          userSelect: none,
          cursor: def,
        });
      }
    })();

    function styleDataToken(title) {
      return `
.youtube-thumbnail-player[alt="${title}"] {
  background: rgba(0, 0, 0, 0) !important;
  display: flex !important;
  align-items: center !important;
  align-content: center !important;
  justify-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  font-size: 20px !important;
  color: rgba(0, 0, 0, 0) !important;
  text-decoration: none !important;
}
      `;
    }

    const youtubePlayerDiv = document.getElementById(
      "youtubePlayerContainerId",
    );
    const youtubePlayer = document.getElementById("youtubePlayerId");

    function createThumbnailElement() {
      const styleElement = document.querySelector("style");
      if (head && styleElement) {
        styleElement.innerHTML = styleDataToken(videoTitle);
      }

      const imgEl = document.createElement("img");
      imgEl.setAttribute("width", "1080");
      imgEl.setAttribute("height", "1920");
      imgEl.setAttribute("id", "youtubeThumbnailPlayerId");
      imgEl.setAttribute("src", "");
      imgEl.setAttribute("alt", "");
      imgEl.classList.add("youtube-thumbnail-player");
      imgEl.setAttribute("loading", "eager");
      imgEl.style.borderRadius = "25px";

      if (youtubePlayerDiv) {
        youtubePlayerDiv.appendChild(imgEl);
      }

      return imgEl;
    }

    function initializeYoutubePlayer() {
      if (!videoId) {
        console.warn("Keine videoId angegeben");
        return;
      }

      const youtubeEmbedUrl = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}/?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&rel=0`;
      const maxresUrl = `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/maxresdefault.jpg`;
      const fallbackUrl = `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/sddefault.jpg`;

      if (youtubePlayerDiv && youtubePlayer) {
        console.log("🎬 Starte YouTube Video...");
        console.log(`📺 Video ID: ${videoId}`);
        console.log(`🎵 Titel: ${videoTitle}`);
        console.log(`⏱️ Dauer: ${videoDuration}ms`);

        youtubePlayer.setAttribute("src", youtubeEmbedUrl);
        youtubePlayer.setAttribute("title", videoTitle);

        if (videoDuration > 0) {
          console.log(
            `⏰ Video wird nach ${videoDuration}ms gestoppt (${Math.round(videoDuration / 1000)}s)`,
          );
          setTimeout(() => {
            console.log("⏹️ Video gestoppt");
            youtubePlayer.setAttribute("src", "");
            youtubePlayer.setAttribute("title", "");
          }, videoDuration);
        }
      }

      if (videoImgDuration > 0) {
        let thumbnailShown = false;

        setTimeout(() => {
          const iframe = youtubePlayer;

          if (!iframe || !iframe.getAttribute("src")) {
            console.warn("⚠️ Video lädt nicht - zeige Thumbnail als Fallback");
            showThumbnailFallback();
            thumbnailShown = true;
          } else {
            console.log("✅ Video lädt erfolgreich - kein Thumbnail nötig");
          }
        }, 2000);

        function showThumbnailFallback() {
          if (thumbnailShown) return;

          console.log("📸 Erstelle Thumbnail-Fallback...");
          const thumbnailImg = createThumbnailElement();

          const testImg = new Image();
          testImg.onload = () => {
            thumbnailImg.setAttribute("src", maxresUrl);
            thumbnailImg.setAttribute("alt", videoTitle);
            console.log("✅ Thumbnail (maxres) angezeigt");
          };
          testImg.onerror = () => {
            thumbnailImg.setAttribute("src", fallbackUrl);
            thumbnailImg.setAttribute("alt", videoTitle);
            console.log("✅ Thumbnail (fallback) angezeigt");
          };
          testImg.src = maxresUrl;

          setTimeout(() => {
            thumbnailImg.setAttribute("src", "");
            thumbnailImg.setAttribute("alt", "");
            if (thumbnailImg.parentNode) {
              thumbnailImg.parentNode.removeChild(thumbnailImg);
            }
            console.log("🗑️ Thumbnail entfernt");
          }, videoImgDuration);

          thumbnailShown = true;
        }
      } else {
        console.log("ℹ️ Kein Thumbnail konfiguriert (videoImgDuration = 0)");
      }
    }

    initializeYoutubePlayer();

    (function elementToken() {
      const youtubeThumbnailPlayerImage = document.getElementById(
        "youtubeThumbnailPlayerId",
      );

      const elementArray = [
        youtubePlayerDiv,
        youtubePlayer,
        youtubeThumbnailPlayerImage,
      ].filter(Boolean);

      const eventArray = [copy, dragstart, keydown, select];

      elementArray.forEach((element) => {
        eventArray.forEach((event) => {
          element.addEventListener(event, (e) => e.preventDefault());
        });

        if (robotoBold) {
          Object.assign(element.style, {
            fontFamily: robotoBold,
            webkitUserSelect: none,
            userSelect: none,
            cursor: def,
          });
        }
      });

      if (youtubePlayerDiv && youtubePlayer) {
        youtubePlayer.style.borderRadius = "25px";
      }
    })();
  } catch (error) {
    console.error("❌ Haupt-Fehler:", error);
  }
});
