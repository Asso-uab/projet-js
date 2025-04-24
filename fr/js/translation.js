// Fonction pour changer de langue
function changeLanguage(lang) {
    // Obtenez le chemin de la page actuelle
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();
    
    // Déterminez si nous sommes à la racine ou dans un sous-dossier
    const isRoot = !currentPath.includes('/pages/') && !currentPath.includes('/pages_fr/');
    
    // Construisez le nouveau chemin selon la langue
    let newPath;
    
    if (lang === 'fr') {
        if (isRoot) {
            // Si nous sommes sur la page d'accueil
            if (fileName === 'index.html' || fileName === '' || fileName === '/') {
                newPath = './index_fr.html';
            } else {
                // Autres pages à la racine
                newPath = currentPath.replace('.html', '_fr.html');
            }
        } else if (currentPath.includes('/pages/')) {
            // Si nous sommes dans le dossier 'pages' (version arabe)
            const basePath = currentPath.substring(0, currentPath.indexOf('/pages/'));
            const pageName = fileName;
            newPath = `${basePath}/pages_fr/${pageName}`;
        } else {
            // Déjà dans pages_fr, ne rien faire
            newPath = currentPath;
        }
    } else { // lang === 'ar'
        if (isRoot) {
            // Si nous sommes sur la page d'accueil française
            if (fileName === 'index_fr.html') {
                newPath = './index.html';
            } else if (fileName.includes('_fr.html')) {
                // Autres pages françaises à la racine
                newPath = currentPath.replace('_fr.html', '.html');
            } else {
                // Déjà en arabe, ne rien faire
                newPath = currentPath;
            }
        } else if (currentPath.includes('/pages_fr/')) {
            // Si nous sommes dans le dossier 'pages_fr' (version française)
            const basePath = currentPath.substring(0, currentPath.indexOf('/pages_fr/'));
            const pageName = fileName;
            newPath = `${basePath}/pages/${pageName}`;
        } else {
            // Déjà dans pages, ne rien faire
            newPath = currentPath;
        }
    }
    
    // Redirigez vers la nouvelle page
    console.log("Redirection vers:", newPath); // Pour le débogage
    window.location.href = newPath;
}

// Initialisez le sélecteur de langue
document.addEventListener('DOMContentLoaded', function() {
    // Pour les boutons de langue
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Déterminer la langue actuelle
    const currentLang = window.location.pathname.includes('_fr') || window.location.pathname.includes('/pages_fr/') ? 'fr' : 'ar';
    
    // Mettre à jour l'état actif des boutons
    langButtons.forEach(button => {
        const buttonLang = button.getAttribute('data-lang');
        if (buttonLang === currentLang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
        
        // Ajouter l'événement de clic
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
});