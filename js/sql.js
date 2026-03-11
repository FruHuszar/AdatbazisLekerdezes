import { iskolaSql, moziSql, ikeaSql, konyvtarSql, jegyekSql } from "./database.js";

initSqlJs({
  locateFile: (fajl) =>
    `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${fajl}`,
}).then((SQL) => {
  const adatbazis = new SQL.Database();
  const adatbazisValaszto = document.getElementById("adatbazisSelector");
  const futtatasGomb = document.getElementById("futtatas");
  const sqlBevitel = document.getElementById("sqlInput");
  const eredmenyMegjelenito = document.getElementById("result");
  const tablazatInformaciok = document.getElementById("databaseInfos");

  // Segédfüggvény az adatbázis újratöltéséhez
  const adatbazisFrissitese = (sqlForras) => {
    try {
      // Meglévő táblák törlése (opcionális, ha teljesen tiszta lap kell)
      const tablak = adatbazis.exec(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';",
      );
      if (tablak.length > 0) {
        tablak[0].values.forEach((sor) => {
          adatbazis.run(`DROP TABLE IF EXISTS ${sor[0]};`);
        });
      }

      // 2. Az új adatok betöltése
      adatbazis.run(sqlForras);

      // 3. UI frissítése
      adatbazisStrukturaMegjelenites();
      eredmenyMegjelenito.innerHTML = "Adatbázis sikeresen váltva!";
    } catch (hiba) {
      console.error("Hiba az adatbázis váltásakor:", hiba);
    }
  };

const adatbazisStrukturaMegjelenites = () => {
    const track = document.getElementById("carouselTrack");
    const dots = document.getElementById("carouselDots");

    track.innerHTML = "";
    dots.innerHTML = "";

    const tablak = adatbazis.exec(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    );

    if (tablak.length === 0) return;

    const tablaLista = tablak[0].values.map(v => v[0]);

    // ===== 1. SLIDE (Az összes tábla összefoglalója) =====
    const listaSlide = document.createElement("div");
    listaSlide.className = "carouselSlide summarySlide"; // Kapott egy extra classt a formázáshoz
    
    // Cím az összefoglalónak
    const summaryTitle = document.createElement("h3");
    summaryTitle.innerText = "ADATBÁZIS ÁTTEKINTÉS";
    listaSlide.appendChild(summaryTitle);

    tablaLista.forEach((tablaNev) => {
        const oszlopInfok = adatbazis.exec(`PRAGMA table_info(${tablaNev});`);
        const oszlopok = oszlopInfok[0].values;

        const oszlopNevek = oszlopok.map((oszlop) => {
            let nev = oszlop[1];
            const pk = oszlop[5] > 0;
            if (pk) return `<b>${nev}</b>`;
            if (nev.endsWith("_id")) return `<i>${nev}</i>`;
            return nev;
        });

        const p = document.createElement("p");
        p.style.margin = "5px 0";
        p.innerHTML = `<strong>${tablaNev.toUpperCase()}</strong>: ${oszlopNevek.join(", ")}`;
        listaSlide.appendChild(p);
    });
    track.appendChild(listaSlide);

    // ===== TOVÁBBI SLIDE-OK (Egyes táblák adatai) =====
    tablaLista.forEach((tablaNev) => {
        const slide = document.createElement("div");
        slide.className = "carouselSlide";

        const adatok = adatbazis.exec(`SELECT * FROM ${tablaNev}`);

        // A táblázatot egy görgethető div-be csomagoljuk
        slide.innerHTML = `
            <h3>${tablaNev.toUpperCase()}</h3>
            <div class="table-container">
                ${HTMLTablazatGeneralas(adatok)}
            </div>
        `;

        track.appendChild(slide);
    });

    initCarousel();
};


  const HTMLTablazatGeneralas = (lekerdezesEredmeny) => {
    if (!lekerdezesEredmeny || lekerdezesEredmeny.length === 0)
      return "Nincs megjeleníthető adat.";

    const { columns: fejlec, values: adatok } = lekerdezesEredmeny[0];

    let html = "<table><thead><tr>";
    fejlec.forEach((nev) => {
      html += `<th>${nev}</th>`;
    });
    html += "</tr></thead><tbody>";

    adatok.forEach((sor) => {
      html +=
        "<tr>" +
        sor.map((ertek) => `<td>${ertek ?? ""}</td>`).join("") +
        "</tr>";
    });

    html += "</tbody></table>";
    return html;
  };

  // Eseményfigyelő a select-re
  adatbazisValaszto.addEventListener("change", () => {
    const valasztott = adatbazisValaszto.value;

    if (valasztott === "iskola") adatbazisFrissitese(iskolaSql);
    else if (valasztott === "mozi") adatbazisFrissitese(moziSql);
    else if (valasztott === "ikea") adatbazisFrissitese(ikeaSql);
    else if (valasztott === "konyvtar") adatbazisFrissitese(konyvtarSql);
    else if (valasztott === "jegyek") adatbazisFrissitese(jegyekSql);
  });

  adatbazis.run(iskolaSql);

  futtatasGomb.addEventListener("click", () => {
    const lekerdezes = sqlBevitel.value.trim();
    
    // 1. Töröljük az előző eredményt, hogy látszódjon a frissítés
    eredmenyMegjelenito.innerHTML = "";

    // 2. Ellenőrizzük, hogy üres-e
    if (lekerdezes === "") {
        eredmenyMegjelenito.innerHTML = "<strong>Nincs adat a mezőben!</strong>";
        return; // Fontos, hogy itt megállítsuk a futást
    }

    try {
        const eredmeny = adatbazis.exec(lekerdezes);

        if (eredmeny.length > 0) {
            eredmenyMegjelenito.innerHTML = HTMLTablazatGeneralas(eredmeny);
        } else {
            eredmenyMegjelenito.innerHTML = "A lekérdezés sikeresen lefutott, de nem adott vissza adatot.";
        }

        // Adatbázis struktúra frissítése, ha módosító parancs volt
        const parancs = lekerdezes.toUpperCase();
        if (
            parancs.includes("CREATE") ||
            parancs.includes("DROP") ||
            parancs.includes("ALTER")
        ) {
            adatbazisStrukturaMegjelenites();
        }
    } catch (hiba) {
        eredmenyMegjelenito.innerHTML = "<span style='color: red;'>● " + hiba.message + "</span>";
    }
});


  adatbazisStrukturaMegjelenites();
});



let aktualisSlide = 0;

function initCarousel(){

    const track = document.getElementById("carouselTrack");
    const slides = document.querySelectorAll(".carouselSlide");
    const dotsContainer = document.getElementById("carouselDots");

    aktualisSlide = 0;

    dotsContainer.innerHTML="";

    slides.forEach((_,i)=>{

        const dot = document.createElement("div");
        dot.className="carouselDot";
        if(i===0) dot.classList.add("active");

        dot.onclick=()=>{
            aktualisSlide=i;
            updateCarousel();
        };

        dotsContainer.appendChild(dot);
    });

    updateCarousel();
}

function updateCarousel(){

    const track = document.getElementById("carouselTrack");
    const dots = document.querySelectorAll(".carouselDot");

    track.style.transform = `translateX(-${aktualisSlide*100}%)`;

    dots.forEach(d=>d.classList.remove("active"));
    dots[aktualisSlide].classList.add("active");
  
}

document.getElementById("prevSlide").onclick=()=>{
    aktualisSlide--;
    if(aktualisSlide<0) aktualisSlide=0;
    updateCarousel();
};

document.getElementById("nextSlide").onclick=()=>{
    const slides = document.querySelectorAll(".carouselSlide");
    aktualisSlide++;
    if(aktualisSlide>=slides.length) aktualisSlide=slides.length-1;
    updateCarousel();
};

