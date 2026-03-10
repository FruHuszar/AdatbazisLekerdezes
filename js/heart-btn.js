document.addEventListener('DOMContentLoaded', function() {
    const heartBtn = document.getElementById('heart-button');

    if (heartBtn) {
        heartBtn.addEventListener('click', function(e) {
            // Megakadályozzuk, hogy a böngésző bármit csináljon a linkkel
            e.preventDefault();

            // 1. Küldés a Google Analytics-nek
            gtag('event', 'heart_click', {
                'event_category': 'engagement',
                'event_label': 'SQL Practice Page',
                'value': 1
            });

            // 2. Vizuális visszajelzés (animáció)
            this.style.display = "inline-block"; // Biztosítjuk, hogy az animáció látszódjon
            this.style.transition = "transform 0.2s";
            this.style.transform = "scale(1.3)";
            
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 200);

            console.log("GA4 esemény elküldve: heart_click");
        });
    }
});
