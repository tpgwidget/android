document.addEventListener('deviceready', function(){
    StatusBar.backgroundColorByHexString("#8E3500");

    $(document).keyup(function(e) {
        if (e.keyCode == 13) { // Touche Enter du clavier
            // Fermer le clavier
            Keyboard.hide();

            // Déselectionner les inputs
            $('input').blur();
        }
    });
});

var myApp = new Framework7({
    material: true
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {});

var welcomescreen_slides = [
  {
    id: 'slide0',
    picture: '<img src="img/slides/1.png">',
    text: 'Bienvenue ! Ce court tutoriel vous expliquera comment fonctionne TPGwidget.'
  },
  {
    id: 'slide1',
    picture: '<img src="img/slides/2.png">',
    text: "TPGwidget permet de créer sur votre écran d'accueil un raccourci pour votre arrêt de bus ou de tram."
  },
  {
    id: 'slide2',
    picture: '<img src="img/slides/3.png">',
    text: "Vous pouvez utiliser n'importe quel arrêt : domicile, travail, école... Et vous pouvez créer autant de raccourcis que vous voulez !"
  },
  {
    id: 'slide3',
    picture: '<img src="img/slides/4.png">',
    text: 'Vous pouvez maintenant choisir quel arrêt vous voulez utiliser :<br><br><a class="button button-raised button-fill button color-white ripple-white close-welcomescreen" href="#">Commencer</a>'
  }
];

var options = {
  'bgcolor': '#f60',
  'fontcolor': '#fff',
  'closeButtonText': 'PASSER'
}

$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});

$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});

$$('.right').on('click', function (e) {
    var welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);
});

if(navigator.onLine){
    var welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);

    $.getJSON("http://tpga.nicolapps.ch/app/stops.php", function (data) {

        $$(".layout-dark").removeClass("layout-dark");
        //$$(".page-content").html('<div class="list-block virtual-list"></div>');
        $$(".graym").remove();
        $$("#contenu, section.fav").show();


        var arr = [];
        $.each(data, function (val, key) {
             //html += val+key;

             arr.push({
                stopCode: key,
                stopName: val
            });
        });

        $(".searchbar-input input").keyup(function() {
            if (!this.value) {
                console.info("Yolo!");
            }
        });

        var template = '<li>'+
         '<a href="http://tpga.nicolapps.ch/app/install.php?id={{stopName}}" class="item-link">'+
            '<div class="item-content">'+
               '<div class="item-inner">'+
                  '<div class="item-title">{{stopCode}}</div>'+
               '</div>'+
            '</div>'+
         '</a>'+
      '</li>';

        var myList = myApp.virtualList('.list-block.virtual-list', {items: arr,
            template: template,
            searchAll: function (query, items) {
                var foundItems = [];
                for (var i = 0; i < items.length; i++) {
                    // Check if title contains query string
                    if(items[i].stopCode.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0 || items[i].stopName.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0) {
                        foundItems.push(i);
                    }
                }
                // Return array with indexes of matched items
                return foundItems;
            }
        });

    });

} else {
    $$(".right").remove();
    $$(".searchbar").remove();
    $$(".searchbar-overlay").remove();
    $$(".graym").html("<h1>😕</h1><h2>Pas de connexion à internet</h2><small>TPGwidget a besoin d'une connexion à internet pour fonctionner. Pour continuer, connectez-vous à internet.</small>");
}

myApp.onPageInit('install', function (page) {
    $$('.button-install').click(function(){

        if($(this).attr('data-tapped') == 0){
            $(this).attr('data-tapped', 1);
        } else {
            myApp.modal({
                title: 'Le bouton ne fonctionne pas ?',
                text: 'Pour utiliser TPGwidget, Google Chrome doit être installé sur votre appareil. Cliquez sur le bouton « Télécharger » pour télécharger Google Chrome sur le Play Store.',
                buttons: [
                    {
                        text: 'Annuler'
                    },
                    {
                        text: 'Télécharger',
                        bold: true,
                        onClick: function(){
                            cordova.InAppBrowser.open("https://play.google.com/store/apps/details?id=com.android.chrome&hl=fr", '_system');
                        }
                    }
                ]
            });
        }

    });
});

document.addEventListener("backbutton", function(){
    mainView.router.back();
}, false);
