﻿window.onload = function () {
    const LARGEUR_GRILLE = 14; // Nombre de cases en largeur
    const HAUTEUR_GRILLE = 28; // Nombre de cases en hauteur
    const CARREAU = 20; // Taille en pixels d'une case de la grille
    const NIVEAU_MAX = 10;
    const LIGNES_PAR_NIVEAU = 10;
    const AUDIO = new Audio('../tetris.mp3');
    AUDIO.load();
    AUDIO.loop = true;
    AUDIO.autoplay;
    let grille = new Array(LARGEUR_GRILLE);
    let formeSuivante = 0;
    let ctrLignes = 0;
    let score = 0;
    let niveau = 1;
    let afficher_grillle = false;
    let canvas; // Un canvas est un élément HTML dans lequel on peut dessiner des formes
    let ctx;

	// Position de la forme sur la grille
	const X_INITIAL = 5;
	const Y_INITIAL = 0;
    let formX = X_INITIAL;
    let formY = Y_INITIAL;
    let delay = 250;

	// Numéro de la forme (du tableau "forme") à afficher 
	let numForme = 0;
	// Sélection de la version de la forme à afficher (différentes rotations possibles)
    let rotation = 0;
    
    // Tableau de définition des couleurs des formes
    const couleursFormes = [
        ["Red", "Black"],
        ["DarkOrange", "Black"],
        ["Magenta", "Black"],
        ["Lime", "Black"],
        ["DodgerBlue", "Black"],
        ["Brown", "Black"],
        ["Yellow", "Black"]
    ]

	// Tableau de définition des formes
    var forme = new Array();
    forme[0]= [ // Forme 1
        [	// rotation 0
            [0,0,0],
            [1,1,1],
            [0,0,1]
        ],
        [	// rotation 1
            [0,1,0],
            [0,1,0],
            [1,1,0]
        ],
        [	// rotation 2
            [1,0,0],
            [1,1,1],
            [0,0,0]
        ],
        [	// rotation 3
            [0,1,1],
            [0,1,0],
            [0,1,0]
        ]
    ]; 
    
	forme[1] = [ // Forme 2
        [	// rotation 0 (cette forme là n'a besoin que de 2 rotations)
            [0, 0,0],
            [0,1,1],
            [1,1,0]
        ],
        [	// rotation 1
            [0,1,0],
            [0,1,1],
            [0,0,1]
        ]
    ];

    forme[2] = [ // Forme 3
        [	// rotation 0 (cette forme là n'a besoin que de 2 rotations)
            [0,0,0],
            [1,1,0],
            [0,1,1]
        ],
        [	// rotation 1
            [0,1,0],
            [1,1,0],
            [1,0,0]
        ]
    ];

    forme[3] = [ // Forme 4
        [	// rotation 0
            [0,1,0],
            [1,1,1],
            [0,0,0]
        ],
        [	// rotation 1
            [0,1,0],
            [0,1,1],
            [0,1,0]
        ],
        [	// rotation 2
            [0,0,0],
            [1,1,1],
            [0,1,0]
        ],
        [	// rotation 3
            [0,1,0],
            [1,1,0],
            [0,1,0]
        ]
    ];

    forme[4] = [ // Forme 5
        [	// rotation 0
            [0,0,0],
            [1,1,1],
            [1,0,0]
        ],
        [	// rotation 1
            [1,1,0],
            [0,1,0],
            [0,1,0]
        ],
        [	// rotation 2
            [0,0,1],
            [1,1,1],
            [0,0,0]
        ],
        [	// rotation 3
            [0,1,0],
            [0,1,0],
            [0,1,1]
        ]
    ];

    forme[5] = [ // Forme 6
        [	// rotation 0
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0]
        ]
    ];

    forme[6] = [ // Forme 7
        [	// rotation 0
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]
        ],
        [	// rotation 1
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0]
        ] 
    ];  

	// !!! Fin du Tableau de définition des formes    
	
	// !!! Fin de déclaration des variables !!!
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////	    
	// !!! Les fonctions !!!

    function initGrille () {
        for(x=0; x<grille.length; x++) {
            grille[x] = new Array(HAUTEUR_GRILLE)
            for(y=0; y<grille[x].length; y++) {
                grille[x][y] = -1;
            }
        }
    }

    ///////////////////////////////////////////////////////
	
    // drawForme()
	//   Dessine une forme à l'écran 
	//   Variable utilisées :
	//		numForme : numéro de la forme à afficher (tableau forme)
	//		rotation : version de la forme à afficher (tableau forme[numForme])
	//		formX : Position horizontale de la forme sur la grille
	//		formY : Position verticale de la forme sur la grille
    function drawForme(numforme, formx, formy, rotationn) {
		for(x=0 ; x<forme[numforme][rotationn].length ; x++) {
			for(y=0 ; y<forme[numforme][rotationn].length ; y++) {
                if(forme[numforme][rotationn][y][x] == 1) {
                    ctx.fillStyle = couleursFormes[numforme][1]; // Couleur du contour de la forme
                    ctx.fillRect((formx + x) * CARREAU, (formy + y) * CARREAU, CARREAU, CARREAU); // Contour de la forme
                    ctx.fillStyle = couleursFormes[numforme][0]; // Couleur de remplissage de la forme
                    ctx.fillRect((formx + x) * CARREAU + 1, (formy + y) * CARREAU + 1, CARREAU - 2, CARREAU - 2); // Remplissage de la forme
                }
            }
        }
    }

    ///////////////////////////////////////////////////////

    function drawShadow (numforme, formx, formy, rotationn) {
        let decalage = findShadowCollision();
        for(x=0 ; x<forme[numforme][rotationn].length ; x++) {
			for(y=0 ; y<forme[numforme][rotationn].length ; y++) {
                if(forme[numforme][rotationn][y][x] == 1) {
                    ctx.fillStyle = couleursFormes[numforme][1]; // Couleur du contour de la forme
                    ctx.fillRect((formx + x) * CARREAU, (formy + y + decalage) * CARREAU, CARREAU, CARREAU); // Contour de la forme
                    ctx.fillStyle = "White"; // Couleur de remplissage de la forme
                    ctx.fillRect((formx + x) * CARREAU + 1, (formy + y + decalage) * CARREAU + 1, CARREAU - 2, CARREAU - 2); // Remplissage de la forme
                }
            }
        }
    }

    ///////////////////////////////////////////////////////

    function findShadowCollision () {
        for(i=0; i<HAUTEUR_GRILLE; i++) {
            for(x=0 ; x<forme[numForme][rotation].length ; x++) {
                for(y=0 ; y<forme[numForme][rotation].length ; y++) {
                    if(forme[numForme][rotation][y][x] == 1) {
                        if(formY + y + i> HAUTEUR_GRILLE - 1) {
                            return i - 1
                        }
                        if(grille[formX + x][formY + y + i] != -1){
                            return i - 1
                        }
                    }
                }
            }
        }
        return 0

    }
    
    ///////////////////////////////////////////////////////

    function copierFormeDansLaGrille() {
        for(x=0 ; x<forme[numForme][rotation].length ; x++) {
			for(y=0 ; y<forme[numForme][rotation].length ; y++) {
                if(forme[numForme][rotation][y][x] == 1) {
                    grille[formX + x][formY + y] = numForme;
                }
            }
        }
    }

    ///////////////////////////////////////////////////////

    function afficherAide () {
        AUDIO.pause();
        window.alert("Bienvenue sur le jeu Tetris !\nVous connaissez probablement les règles, alors voici les commandes :\n\n   Faire pivoter les pièces : flèches haut et bas du clavier\n   Déplacer les pièces : flèches gauche et droite du clavier\n   Faire tomber une pièce plus rapidement : barre espace\n   Mettre le jeu en pause : entrer\n\nPour réafficher cette aide à tout moment dans le jeu, appuyer sur 'h'.\n\nBon jeu !")
        AUDIO.play();
    }

    ///////////////////////////////////////////////////////

    function mettre_pause () {
        AUDIO.pause();
        window.alert("Le jeu est en pause.\nPour reprendre, cliquez sur 'OK'.")
        AUDIO.play();
    }

    ///////////////////////////////////////////////////////

    function drawGrille () {
        for(x=0 ; x<grille.length ; x++) {
			for(y=0 ; y<grille[x].length ; y++) {
                if(grille[x][y] != -1) {
                    ctx.fillStyle = couleursFormes[grille[x][y]][1]; // Couleur du contour de la forme
                    ctx.fillRect(x * CARREAU, y * CARREAU, CARREAU, CARREAU); // Contour de la forme
                    ctx.fillStyle = couleursFormes[grille[x][y]][0]; // Couleur de remplissage de la forme
                    ctx.fillRect(x * CARREAU + 1, y * CARREAU + 1, CARREAU - 2, CARREAU - 2); // Remplissage de la forme
                }
            }
            if(afficher_grillle) {
                colors = ["darkblue", "darkred"]
                ctx.lineWidth = 1;
                for (i=1; i<LARGEUR_GRILLE; i++) {
                    ctx.beginPath();
                    ctx.moveTo(i * CARREAU, 0)
                    ctx.lineTo(i * CARREAU, HAUTEUR_GRILLE * CARREAU);
                    if(i%2 == 0) {ctx.strokeStyle = colors[0]}
                    else {ctx.strokeStyle = colors[1]}
                    ctx.stroke();
                }
            }
        }
    }

    ///////////////////////////////////////////////////////

    function nouvelleForme () {
        return Math.floor(Math.random() * (forme.length))
    }

    ///////////////////////////////////////////////////////

    function effaceLigne (numero) {
        for(i=numero; i>1; i--) {
            for(j=0; j<LARGEUR_GRILLE; j++) {
                grille[j][i] = grille[j][i-1]
            }
        }
    }

    ///////////////////////////////////////////////////////

    function verifierLignes () {
        nombre = 0;
        for(i=0; i< grille[0].length; i++) {
            minus_one_present = false
            for(j=0; j<grille.length; j++) {
                if(grille[j][i] == -1) {minus_one_present = true}
            }
            if (! minus_one_present) {
                nombre++;
                effaceLigne(i)
                ctrLignes++
            }
        }
        return nombre;
    }

    ///////////////////////////////////////////////////////
    // refreshCanvas()
	//   Rafraichi l'affichage :
	//      - efface le canvas
	//      - dessine la forme
    //      Utilisation de l'objet canvas : https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Basic_usage
    function refreshCanvas() {
		ctx.clearRect(0,0,LARGEUR_GRILLE * CARREAU, HAUTEUR_GRILLE * CARREAU); // Efface la grille
        drawShadow(numForme, formX, formY, rotation, 3);
		drawForme(numForme, formX, formY, rotation); // Dessine la forme
        ctx.clearRect(LARGEUR_GRILLE * CARREAU + 5, 20, 150, 100);
        drawForme(formeSuivante, 16, 1.5, 0);
        ctx.clearRect(LARGEUR_GRILLE * CARREAU + 50, 190, 50, 30);
        ctx.fillStyle = "Black";
        ctx.fillText(ctrLignes, (LARGEUR_GRILLE * CARREAU) + 70, 210);
        ctx.clearRect(LARGEUR_GRILLE * CARREAU + 30, 260, 90, 30);
        ctx.fillText(score, LARGEUR_GRILLE * CARREAU + 50, 280);
        ctx.clearRect(LARGEUR_GRILLE * CARREAU + 50, 330, 50, 30);
        ctx.fillText(niveau, LARGEUR_GRILLE * CARREAU + 70, 350);
        drawGrille();
        setTimeout(() => {
            formY++; // La forme descend
            if(collision() == 1) {
                formY--; // En cas de collision on revient en arrière
                copierFormeDansLaGrille();
                lignes = verifierLignes();
                score = score + 100 * lignes * lignes * niveau;
                if (ctrLignes >= niveau * LIGNES_PAR_NIVEAU && niveau < NIVEAU_MAX) {
                    niveau = Math.floor(ctrLignes/LIGNES_PAR_NIVEAU) + 1
                    delay = 250 - (20 * (niveau - 1))
                }
                formY = Y_INITIAL; // Une nouvelle forme arrive en haut du canvas
                formX = X_INITIAL;
                numForme = formeSuivante;
                formeSuivante = nouvelleForme();
                rotation = 0;
                if(delay = 30) delay = 250 - (20 * (niveau - 1));
            }
            if(collision() == 2) {
                fin_de_partie();
            }
            refreshCanvas();
          }, delay);
          
    }
    ///////////////////////////////////////////////////////
    // init()
	//   Initialisation du canvas
    function init() {
        afficherAide();
        initGrille();
        numForme = nouvelleForme();
        formeSuivante = nouvelleForme();
        canvas = document.createElement('canvas');
        canvas.width = (LARGEUR_GRILLE * CARREAU) + 150;
        canvas.height = HAUTEUR_GRILLE * CARREAU;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);  // Ajoute le canvas à la page html
        ctx = canvas.getContext('2d');
        ctx.font = "15px serif";
        ctx.fillText("Prochaine forme", (LARGEUR_GRILLE * CARREAU) + 10, 20);
        ctx.fillText("Lignes complétées", (LARGEUR_GRILLE * CARREAU) + 5, 180);
        ctx.fillText("Score", (LARGEUR_GRILLE * CARREAU) + 50, 250);
        ctx.fillText("Niveau", (LARGEUR_GRILLE * CARREAU) + 47, 320);
        ctx.lineTo(10, 500)
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(LARGEUR_GRILLE * CARREAU, 0);
        ctx.lineTo(LARGEUR_GRILLE * CARREAU, HAUTEUR_GRILLE * CARREAU);

        // Draw the Path
        ctx.stroke();


		refreshCanvas();
    }

    ///////////////////////////////////////////////////////


    function fin_de_partie () {
        AUDIO.pause();
        if (confirm("Fin de la partie !\n\nVous avez complété " + ctrLignes + " lignes.\nVotre score est de " + score + ".\nVous avez atteint le niveau " + niveau + "/10.\n\nAppuyez sur 'OK' pour rejouer ou sur 'Cancel' pour arrêter le jeu.")) {
            formY--;
            location.reload();
          } else {
            formY--;
            delay = 10000000;
          }
    }


    ///////////////////////////////////////////////////////


    function collision() {
        for(x=0 ; x<forme[numForme][rotation].length ; x++) {
			for(y=0 ; y<forme[numForme][rotation].length ; y++) {
                if(forme[numForme][rotation][y][x] == 1) {
                    if(formX + x < 0){return 1}
                    if(formX + x > LARGEUR_GRILLE - 1) {return 1}
                    if(formY + y > HAUTEUR_GRILLE - 1) {
                        if (formY == 0 || formY == 1){return 2}
                        return 1
                    }
                    if(grille[formX + x][formY + y] != -1){
                        if (formY == 0 || formY == 1){return 2}
                        return 1
                    }
                }
            }
        }
        return 0
    }
    // !!! Fin des fonctions !!!
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !!! Code !!!
	// Seule ligne de code... avec la gestion des évènements clavier
    init();

	// Gestion des évènements clavier
    window.addEventListener("keydown", function(event) {
        var key = event.key;
        switch(key) {
            // Remarque : Pour connaitre les "keycodes" : https://keycode.info/
            case 'ArrowUp':  // flèche haut => rotation horaire de la forme
                temp = rotation;	// On mémorise la rotation actuelle
                rotation++; 		// On passe à la rotation suivante
                if(rotation > forme[numForme].length - 1) rotation = 0;
                if(collision()) rotation = temp; // Si la rotation est impossible on revient à la précédente
                break;
            
            case 'ArrowDown' : //flèche bas => rotation anti-horaire de la forme
                temp = rotation;	// On mémorise la rotation actuelle
                rotation--; 		// On passe à la rotation suivante
                if(rotation < 0) rotation = forme[numForme].length - 1;
                if(collision()) rotation = temp; // Si la rotation est impossible on revient à la précédente
                break;

            case 'ArrowRight' :
                temp = formX;	// On mémorise la rotation actuelle
                formX++; 		// On passe à la rotation suivante
                if(collision()) formX = temp; // Si la rotation est impossible on revient à la précédente
                break;

            case 'ArrowLeft' :
                temp = formX;	// On mémorise la rotation actuelle
                formX--; 		// On passe à la rotation suivante
                if(collision()) formX = temp; // Si la rotation est impossible on revient à la précédente
                break;

            case ' ' :
                delay = 30;
                break;
            
            case 'e' :
                fin_de_partie();
                break;

            case 'Enter' :
                mettre_pause();
                break;

            case 'h' : 
                afficherAide();
                break;
        }
      }, true);
}
