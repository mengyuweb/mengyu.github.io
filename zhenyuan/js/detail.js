$(function () {
  var player = $("#audio")[0];
  var player1 = $("#video")[0];
  $(".alert-content-tab-item").click(function () {
    $(".alert-content-tab-item").removeClass("active");
    var _index = $(this).index();
    if (_index !== 1) {
      player1.pause();
    }
    $("div[class^='tab_']").hide();
    $(".tab_" + _index).css("display", "block");
    $(this).addClass("active");
  })


  $(".carousel-item").click(function () {
    $(".carousel-item").removeClass("active");
    var src = $(this).children("img").attr("src");
    $(".alert-content-right-up >img").attr("src", src);
    $(this).addClass("active");
  })

  $(".switch-video").click(function () {
    if (player.paused) {
      player.play();
      $(this).addClass("active");
    } else {
      player.load();
      $(this).removeClass("active");
    }
  })

  $(".close").click(function () {
    var player = $("#audio")[0];
    var player1 = $("#video")[0];
    player.load();
    player1.load();
    init();
  })

  function init() {
    $(".alert-content-tab-item").removeClass("active");
    $(".switch-video").removeClass("active");
    $(".alert-content-tab-item").eq(0).addClass("active");
    $("div[class^='tab_']").hide();
    $(".tab_0").css("display", "block");
  }
})

