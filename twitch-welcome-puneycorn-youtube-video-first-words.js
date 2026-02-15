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
        console.log("✅ Streamer.bot verbunden!");
      },
      onDisconnect: () => {
        console.warn("⚠️ Streamer.bot getrennt - versuche Reconnect...");
      },
      onError: () => {
        console.error("❌ Streamer.bot Verbindungsfehler!");
      },
    });

    const videoId = params.get("videoId") || "";
    const videoTitle = params.get("videoTitle") || "";
    const videoDuration = parseInt(params.get("videoDuration") || "0", 10);

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

    const youtubePlayerDiv = document.getElementById(
      "youtubePlayerContainerId",
    );
    const youtubePlayer = document.getElementById("youtubePlayerId");

    function initializeYoutubePlayer() {
      if (!videoId) {
        console.warn("⚠️ Keine videoId angegeben");
        return;
      }

      if (!youtubePlayerDiv || !youtubePlayer) {
        console.error("❌ YouTube Player Elemente nicht gefunden!");
        return;
      }

      const youtubeEmbedUrl = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}/?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&controls=${controls ? 1 : 0}&loop=${loop ? 1 : 0}&rel=0`;

      console.log("🎬 Starte YouTube Video...");
      console.log(`📺 Video ID: ${videoId}`);
      console.log(`🎵 Titel: ${videoTitle}`);
      console.log(
        `⏱️ Dauer: ${videoDuration}ms (${Math.round(videoDuration / 1000)}s)`,
      );

      youtubePlayer.setAttribute("src", youtubeEmbedUrl);
      youtubePlayer.setAttribute("title", videoTitle);
      console.log("✅ Video gestartet!");

      if (videoDuration > 0) {
        console.log(`⏰ Video wird nach ${videoDuration}ms gestoppt`);
        setTimeout(() => {
          console.log("⏹️ Video wird gestoppt...");
          youtubePlayer.setAttribute("src", "");
          youtubePlayer.setAttribute("title", "");
          console.log("✅ Video gestoppt!");
        }, videoDuration);
      }
    }

    initializeYoutubePlayer();

    (function elementToken() {
      const elementArray = [youtubePlayerDiv, youtubePlayer].filter(Boolean);
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

      if (youtubePlayer) {
        youtubePlayer.style.borderRadius = "25px";
      }
    })();

    console.log("🎬 PuneyCorn YouTube Player bereit!");
  } catch (error) {
    console.error("❌ Haupt-Fehler:", error);
  }
});
