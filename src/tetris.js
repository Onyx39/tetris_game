window.onload = function () {
    const LARGEUR_GRILLE = 14; // Nombre de cases en largeur
    const HAUTEUR_GRILLE = 28; // Nombre de cases en hauteur
    const CARREAU = 20; // Taille en pixels d'une case de la grille
    const grille = new Array(LARGEUR_GRILLE);
    let formeSuivante = 0;
    let ctrLignes = 0;
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
        }
    }

    ///////////////////////////////////////////////////////

    function nouvelleForme () {
        return Math.floor(Math.random() * (forme.length))
    }

    ///////////////////////////////////////////////////////

    function effaceLigne (numero) {
        for(i=numero; i>1; i--) {
            console.log(i);
            for(j=0; j<LARGEUR_GRILLE; j++) {
                grille[j][i] = grille[j][i-1]
            }
        }
    }

    ///////////////////////////////////////////////////////

    function verifierLignes () {
        console.log("verifier ligne", grille.length);
        nombre = 0;
        for(i=0; i< grille[0].length; i++) {
            minus_one_present = false
            for(j=0; j<grille.length; j++) {
                if(grille[j][i] == -1) {minus_one_present = true}
            }
            if (! minus_one_present) {
                console.log("found!!!!!!!!!!")
                nombre++;
                effaceLigne(i)
                ctrLignes++;
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
		drawForme(numForme, formX, formY, rotation); // Dessine la forme
        ctx.clearRect(LARGEUR_GRILLE * CARREAU + 5, 20, 150, 100);
        drawForme(formeSuivante, 16, 1.5, 0);
        ctx.clearRect(LARGEUR_GRILLE * CARREAU + 50, 190, 50, 500);
        ctx.fillStyle = "Black";
        ctx.fillText(ctrLignes, (LARGEUR_GRILLE * CARREAU) + 70, 210);
        drawGrille();
        setTimeout(() => {
            formY++; // La forme descend
            if(collision()) {
                formY--; // En cas de collision on revient en arrière
                copierFormeDansLaGrille();
                verifierLignes();
                formY = Y_INITIAL; // Une nouvelle forme arrive en haut du canvas
                formX = X_INITIAL;
                numForme = formeSuivante;
                formeSuivante = nouvelleForme();
                rotation = 0;
                if(delay = 100) delay = 250;
            }
            //delay--;
            refreshCanvas();
          }, delay);
          
    }
    ///////////////////////////////////////////////////////
    // init()
	//   Initialisation du canvas
    function init() {
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
        ctx.fillText("Lignes complétées", (LARGEUR_GRILLE * CARREAU) + 5, 175);
        ctx.fillText(ctrLignes, (LARGEUR_GRILLE * CARREAU) + 70, 210);
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


    function collision() {
        for(x=0 ; x<forme[numForme][rotation].length ; x++) {
			for(y=0 ; y<forme[numForme][rotation].length ; y++) {
                if(forme[numForme][rotation][y][x] == 1) {
                    if(formX + x < 0){return true}
                    if(formX + x > LARGEUR_GRILLE - 1) {return true}
                    if(formY + y > HAUTEUR_GRILLE - 1) {return true}
                    if(grille[formX + x][formY + y] != -1){return true}
                }
            }
        }
        return false
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
                // if(formX < LARGEUR_GRILLE - 3) formX++;

                temp = formX;	// On mémorise la rotation actuelle
                formX++; 		// On passe à la rotation suivante
                if(collision()) formX = temp; // Si la rotation est impossible on revient à la précédente
                break;

            case 'ArrowLeft' :
                // if(formX > 0) formX--;
                temp = formX;	// On mémorise la rotation actuelle
                formX--; 		// On passe à la rotation suivante
                if(collision()) formX = temp; // Si la rotation est impossible on revient à la précédente
                break;

            case ' ' :
                delay = 50;
                break;
            
            case 'e' :
                effaceLigne(25);
                break;

            case 't':  // touche t
                // à compléter
				// pour test, ne fait pas parti du jeu final
				// permet de changer la pièce à afficher (changement de la variable numForme)
                numForme++;
                rotation = 0;
                if(numForme > forme.length - 1) numForme = 0;
                break;
        }
      }, true);
}
