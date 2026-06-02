importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Tenemos que inicializar Firebase también dentro del Service Worker
firebase.initializeApp({
    apiKey: "AIzaSyBlhcbzEWkC0cQq2JcQ1wv5bJ4sZ1NtEiA",
    projectId: "rl-peto",
    messagingSenderId: "754889536596",
    appId: "1:754889536596:web:fab9b16819d248085fa9c1"
});

const messaging = firebase.messaging();

// Esto es lo que pinta la notificación cuando la app está cerrada
messaging.onBackgroundMessage((payload) => {
    console.log('Mensaje recibido en segundo plano:', payload);
    // Ya no llamamos a showNotification porque Firebase lo hace automáticamente
});

const CACHE_NAME = 'rl-hub-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './img/logo.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos de RL Hub en caché');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Activación y limpieza de cachés antiguos (borra el rastro de RL Peto)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    event.waitUntil(clients.claim());
});

// Interceptar peticiones para que funcione sin internet
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});