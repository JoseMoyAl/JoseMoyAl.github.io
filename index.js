$(document).ready(function () {
  var envelope = $("#envelope");
  var btn_open = $("#open");
  var btn_reset = $("#reset");
  var bigLetter = $("#big-letter");

  var isEnvelopeOpened = false;

  // Abrir el sobre al hacer click en el sobre
  envelope.click(function () {
    if (!isEnvelopeOpened) {
      openEnvelope();
    }
  });

  // Botón Open / Leer
  btn_open.click(function () {
    if (!isEnvelopeOpened) {
      // Primer click: abre sobre
      openEnvelope();
    } else {
      // Segundo click: muestra carta grande
      showBigLetter();
    }
  });

  function openEnvelope() {
    envelope.addClass("open").removeClass("close");
    isEnvelopeOpened = true;
    btn_open.text("Leer");
  }

  function showBigLetter() {
    // Ocultar sobre y botones con fade
    $(".envlope-wrapper").fadeOut(600);
    $(".reset").fadeOut(600);

    // Mostrar carta grande
    bigLetter.removeClass("hidden");

    // Inicializar acordeón: todo cerrado
    $(".accordion-panel").hide();
    // Abrir automáticamente la primera sección ("Bienvenida")
    $(".accordion-item").first().find(".accordion-panel").slideDown(300);

    // Scroll suave hasta la carta grande
    $("html, body").animate(
      { scrollTop: bigLetter.offset().top },
      600
    );
  }

  // -------- Botón Close que se mueve por la pantalla --------
  function moveResetButton() {
    var $btn = btn_reset;

    if (!$btn.hasClass("floating")) {
      var offset = $btn.offset();

      $btn
        .addClass("floating")
        .css({
          position: "fixed",
          left: offset.left,
          top: offset.top,
          margin: 0
        });
    }

    var btnWidth = $btn.outerWidth();
    var btnHeight = $btn.outerHeight();

    var maxX = $(window).width() - btnWidth;
    var maxY = $(window).height() - btnHeight;

    var newLeft = Math.random() * maxX;
    var newTop = Math.random() * maxY;

    $btn.css({ left: newLeft + "px", top: newTop + "px" });
  }

  // PC: el botón Close huye al pasar el mouse
  btn_reset.on("mouseenter", function () { moveResetButton(); });

  // Móvil: huye al intentar tocarlo
  btn_reset.on("touchstart click", function (e) {
    e.preventDefault();
    moveResetButton();
  });

  // -------- Acordeón suave con slideDown/slideUp --------
  $(document).on("click", ".accordion-header", function () {
    var $item = $(this).closest(".accordion-item");
    var $panel = $item.find(".accordion-panel");

    // Cerrar todos los demás
    $(".accordion-panel").not($panel).slideUp(250);

    // Abrir/cerrar este
    $panel.stop(true, true).slideToggle(250);

    // Si es "La pregunta" y se abre, lanzar confetti
    if ($item.data("section") === "question" && $panel.is(":visible") === false) {
      // Si estaba visible y ahora se ocultará con slideToggle, no dispares confetti
    } else if ($item.data("section") === "question" && $panel.is(":visible")) {
      launchHeartConfetti();
    }
  });

  // Confetti de corazones al abrir "La pregunta"
  function launchHeartConfetti() {
    var numHearts = 25;

    for (var i = 0; i < numHearts; i++) {
      var $heart = $("<div class='confetti-heart'>❤</div>");

      var left = Math.random() * 100; // porcentaje
      var duration = 2 + Math.random() * 2; // 2–4s
      var delay = Math.random() * 0.8; // pequeño retardo

      $heart.css({
        left: left + "vw",
        animationDuration: duration + "s",
        animationDelay: delay + "s"
      });

      $("body").append($heart);

      // Quitar el corazón del DOM luego de la animación
      (function (h) {
        setTimeout(function () { h.remove(); }, (duration + delay) * 1000);
      })($heart);
    }
  }
});
