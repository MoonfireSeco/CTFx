function initialiseDialogs() {
    initialiseLoginDialog(), showPageLoadModalDialogs()
}

function initialiseLoginDialog() {
    $("#login-dialog").on("shown.bs.modal", function(t) {
        $("#login-dialog").find("input").first().focus()
    })
}

function showPageLoadModalDialogs() {
    $(".modal.on-page-load").modal()
}

function highlightSelectedMenuItem() {
    for (var t = window.location.pathname, e = document.querySelectorAll('.nav a[href$="' + t + '"]'), n = 0; n < e.length; n++) {
        e[n] && e[n].parentNode && (e[n].parentNode.className = "active") && (e[n].innerHTML = "<b>&gt; </b>" + e[n].innerHTML);
    }
}

function addNavbarMouseoverEffects() {
    for (var t = document.getElementsByClassName("shuffle-text"), e = document.getElementById("audio-navbar"), n = document.getElementById("audio-navclick"), o = 0, i = t.length; o < i; o++) {
        var a = t[o];
        if (0 == a.parentNode.classList.contains("active")) {
            a.addEventListener("mouseenter", function() {
                e.currentTime = 0, e.play()
            }), a.addEventListener("click", function() {
                n.play()
            })
        }
    }
}

function addButtonMouseoverEffects() {
    for (var t = [].concat([].slice.call(document.getElementsByClassName("btn")), [].slice.call(document.getElementsByClassName("close")), [].slice.call(document.getElementsByClassName("category-link"))), e = document.getElementById("audio-button-mouseover"), n = document.getElementById("audio-button-click"), o = document.getElementById("audio-button-small-mouseover"), i = document.getElementById("audio-button-small-click"), a = document.getElementById("audio-button-cancel-mouseover"), s = document.getElementById("audio-button-cancel-click"), l = 0, r = t.length; l < r; l++) t[l].classList.contains("btn-4") || t[l].classList.contains("close") ? (t[l].addEventListener("mouseenter", function() {
        a.currentTime = 0, a.play()
    }), t[l].addEventListener("click", function() {
        s.currentTime = 0, s.play()
    })) : t[l].classList.contains("btn-xs") || t[l].classList.contains("category-link") ? t[l].parentNode.classList.contains("active") || (t[l].addEventListener("mouseenter", function() {
        o.currentTime = 0, o.play()
    }), t[l].addEventListener("click", function() {
        i.currentTime = 0, i.play()
    }), t[l].addEventListener("mouseout", function() {
        o.pause()
    })) : (t[l].addEventListener("mouseenter", function() {
        e.currentTime = 0, e.play()
    }), t[l].addEventListener("click", function() {
        n.currentTime = 0, n.play()
    }), t[l].addEventListener("mouseout", function() {
        e.pause()
    }))
}

function addDropdownMouseoverEffects() {
    for (var t = document.getElementsByClassName("dropdown-menu"), e = document.getElementById("audio-dropdown-open"), n = 0, o = t.length; n < o; n++) t[n].addEventListener("click", function() {
        e.currentTime = 0, e.play()
    })
}

function addFooterMouseoverEffects() {
    var t = document.getElementById("footer-fade"),
        e = document.getElementById("audio-footer-mouseover");
    t.addEventListener("mouseenter", function() {
        e.currentTime = 0, e.play()
    })
}

function addCheckboxClickEffects() {
    for (var t = document.getElementsByTagName("input"), e = document.getElementById("audio-checkbox-click"), n = 0, o = t.length; n < o; n++) "checkbox" == t[n].type && t[n].addEventListener("click", function() {
        e.currentTime = 0, e.play()
    })
}

function typeWriterSFX() {
    var t = document.getElementsByClassName("typewriter")[0],
        e = document.getElementById("audio-typewriter");
    null != t && (e.play(), setTimeout(function() {
        e.pause()
    }, 300 + 1e3 / 65 * t.innerText.length))
}

function highlightLoggedOnTeamName() {
    var t = document.getElementsByClassName("team_" + global_dict.user_id)[0];
    null != t && (t.classList.add("our-team"), t.parentNode.style.textDecorationColor = "#14E0FE")
}

function initialiseCountdowns() {
    var t = $("[data-countdown]");
    $("[data-countdown]").length && setInterval(function() {
        t.each(function() {
            var t = $(this),
                e = t.data("countdown"),
                n = new Date(1e3 * e),
                o = Math.floor((n.getTime() - Date.now()) / 1e3),
                i = t.attr("data-countdown-done") || "No time remaining",
                a = o <= 0 ? i : prettyPrintTime(o);
            t.text(a)
        })
    }, 1e3)
}

function initialiseTooltips() {
    $(".has-tooltip").tooltip()
}

function setFormSubmissionBehaviour() {
    $("form").on("submit", function(t) {
        $("button").prop("disabled", !0)
    })
}

function pluralise(t, e) {
    return t ? t + " " + e + (t > 1 ? "s" : "") : ""
}

function prettyPrintTime(t) {
    t = Math.floor(t);
    var e = Math.floor(t / 60),
        n = Math.floor(e / 60),
        o = pluralise(Math.floor(n / 24), "day"),
        i = pluralise(n % 24, "hour"),
        a = pluralise(e % 60, "minute"),
        s = pluralise(t % 60, "second"),
        l = [];
    return o && l.push(o), i && l.push(i), a && l.push(a), s && l.push(s), l.join(", ") + " remaining"
}

$(document).ready(function() {
    highlightSelectedMenuItem(), highlightLoggedOnTeamName(), typeWriterSFX(), addNavbarMouseoverEffects(), addButtonMouseoverEffects(), addDropdownMouseoverEffects(), addCheckboxClickEffects(), initialiseDialogs(), initialiseTooltips(), initialiseCountdowns(), setFormSubmissionBehaviour()
});