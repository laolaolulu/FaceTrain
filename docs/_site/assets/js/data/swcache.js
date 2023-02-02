const resource = [
    /* --- CSS --- */
    '/1/assets/css/style.css',

    /* --- PWA --- */
    '/1/app.js',
    '/1/sw.js',

    /* --- HTML --- */
    '/1/index.html',
    '/1/404.html',

    
        '/1/categories/',
    
        '/1/tags/',
    
        '/1/archives/',
    
        '/1/about/',
    

    /* --- Favicons & compressed JS --- */
    
    
        '/1/assets/img/favicons/android-chrome-192x192.png',
        '/1/assets/img/favicons/android-chrome-512x512.png',
        '/1/assets/img/favicons/apple-touch-icon.png',
        '/1/assets/img/favicons/favicon-16x16.png',
        '/1/assets/img/favicons/favicon-32x32.png',
        '/1/assets/img/favicons/favicon.ico',
        '/1/assets/img/favicons/mstile-150x150.png',
        '/1/assets/js/dist/categories.min.js',
        '/1/assets/js/dist/commons.min.js',
        '/1/assets/js/dist/home.min.js',
        '/1/assets/js/dist/misc.min.js',
        '/1/assets/js/dist/page.min.js',
        '/1/assets/js/dist/post.min.js',
        '/1/assets/js/dist/pvreport.min.js'
];

/* The request url with below domain will be cached */
const allowedDomains = [
    

    '',

    

    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net',
    'polyfill.io'
];

/* Requests that include the following path will be banned */
const denyUrls = [
    
];

