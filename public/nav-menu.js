const menuBars = document.getElementById('menu-bars');

function toggleNav() {
    if (menuBars.classList.contains('change')) {
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("myOverlay").style.display = "none";
    } else {
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("myOverlay").style.display = "block";
    }
    menuBars.classList.toggle('change');
}

menuBars.addEventListener('click', toggleNav);
