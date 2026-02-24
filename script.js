const menuBtn = document.getElementById('menuBtn');
const fullMenu = document.getElementById('fullMenu');

fullMenu.style.display = 'none';

menuBtn.addEventListener('click', () => {
    fullMenu.style.display = fullMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Következő billentyű lenyomásra bezárjuk
document.addEventListener('keydown', () => {
    if(fullMenu.style.display === 'flex') {
        fullMenu.style.display = 'none';
    }
});