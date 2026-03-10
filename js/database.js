  export const iskolaSql = `
    CREATE TABLE Szulo (id INTEGER PRIMARY KEY, nev TEXT NOT NULL, telefon TEXT, email TEXT);
    CREATE TABLE Osztaly (id INTEGER PRIMARY KEY, nev TEXT NOT NULL);
    CREATE TABLE Tanulo (id INTEGER PRIMARY KEY, nev TEXT NOT NULL, szuletesi_datum TEXT NOT NULL, cim TEXT, osztaly_id INTEGER, szulo_id INTEGER, FOREIGN KEY (osztaly_id) REFERENCES Osztaly(id), FOREIGN KEY (szulo_id) REFERENCES Szulo(id));
    CREATE TABLE Tantargy (id INTEGER PRIMARY KEY, nev TEXT NOT NULL);
    CREATE TABLE TanuloTantargy (tanulo_id INTEGER NOT NULL, tantargy_id INTEGER NOT NULL, ev INTEGER NOT NULL, jegy NUMERIC, PRIMARY KEY (tanulo_id, tantargy_id, ev), FOREIGN KEY (tanulo_id) REFERENCES Tanulo(id), FOREIGN KEY (tantargy_id) REFERENCES Tantargy(id));

    INSERT INTO Szulo VALUES (1,'Anna Nagy','123456789','anna@example.com'), (2,'Béla Kovács','987654321','bela@example.com');
    INSERT INTO Osztaly VALUES (1,'9.A'), (2,'10.B');
    INSERT INTO Tanulo VALUES (1,'József Kovács','2008-04-12','Budapest',1,1), (2,'Eszter Tóth','2007-09-30','Debrecen',2,2);
    INSERT INTO Tantargy VALUES (1,'Matematika'),(2,'Fizika');
    INSERT INTO TanuloTantargy VALUES (1,1,2025,4.5), (1,2,2025,3.0), (2,1,2025,5.0), (2,2,2025,4.0);
  `;
  export const moziSql = `
    CREATE TABLE Film (id INTEGER PRIMARY KEY, cim TEXT NOT NULL, mufaj TEXT, hossz_perc INTEGER, korhatar INTEGER);
    CREATE TABLE Terem (id INTEGER PRIMARY KEY, nev TEXT, kapacitas INTEGER);
    CREATE TABLE Vetites (id INTEGER PRIMARY KEY, film_id INTEGER, terem_id INTEGER, idopont TEXT, jegyar INTEGER, FOREIGN KEY (film_id) REFERENCES Film(id), FOREIGN KEY (terem_id) REFERENCES Terem(id));
    CREATE TABLE Nezo (id INTEGER PRIMARY KEY, nev TEXT, email TEXT);
    CREATE TABLE Jegy (id INTEGER PRIMARY KEY, vetites_id INTEGER, nezo_id INTEGER, szekszam TEXT, FOREIGN KEY (vetites_id) REFERENCES Vetites(id), FOREIGN KEY (nezo_id) REFERENCES Nezo(id));

    INSERT INTO Film VALUES (1, 'Dűne: Második rész', 'Sci-fi', 166, 12), (2, 'Deadpool & Rozsomák', 'Akció', 128, 16);
    INSERT INTO Terem VALUES (1, 'IMAX Terem', 300), (2, 'VIP Szekció', 40);
    INSERT INTO Vetites VALUES (1, 1, 1, '2025-03-01 18:00', 2500), (2, 2, 2, '2025-03-01 20:30', 4500);
    INSERT INTO Nezo VALUES (1, 'Harsányi Gábor', 'h.gabor@mail.com'), (2, 'Kiss Virág', 'virag88@mail.com');
    INSERT INTO Jegy VALUES (1, 1, 1, 'L12'), (2, 1, 2, 'L13'), (3, 2, 2, 'A1');
`;
  export const ikeaSql = `
    CREATE TABLE Raktarhely (id INTEGER PRIMARY KEY, sor TEXT, polc INTEGER);
    CREATE TABLE Alkatresz (id INTEGER PRIMARY KEY, nev TEXT NOT NULL, raktarhely_id INTEGER, keszlet INTEGER, FOREIGN KEY (raktarhely_id) REFERENCES Raktarhely(id));
    CREATE TABLE Butor (id INTEGER PRIMARY KEY, nev TEXT NOT NULL, kategoria TEXT, ar INTEGER);
    CREATE TABLE ButorAlkatresz (butor_id INTEGER, alkatresz_id INTEGER, mennyiseg INTEGER, PRIMARY KEY (butor_id, alkatresz_id), FOREIGN KEY (butor_id) REFERENCES Butor(id), FOREIGN KEY (alkatresz_id) REFERENCES Alkatresz(id));
    CREATE TABLE Rendeles (id INTEGER PRIMARY KEY, vasarlo_nev TEXT, datum TEXT);
    CREATE TABLE RendelesTetel (id INTEGER PRIMARY KEY, rendeles_id INTEGER, butor_id INTEGER, mennyiseg INTEGER, FOREIGN KEY (rendeles_id) REFERENCES Rendeles(id), FOREIGN KEY (butor_id) REFERENCES Butor(id));

    INSERT INTO Raktarhely VALUES (1, 'A', 12), (2, 'B', 05), (3, 'C', 22);
    INSERT INTO Alkatresz VALUES (1, 'M6 Csavar', 1, 5000), (2, 'Fenyő falap 120x60', 2, 45), (3, 'Fém asztalláb', 3, 120);
    INSERT INTO Butor VALUES (1, 'INGVAR Asztal', 'Iroda', 25000), (2, 'KALLAX Polc', 'Nappali', 15000);
    INSERT INTO ButorAlkatresz VALUES (1, 1, 16), (1, 2, 1), (1, 3, 4);
    INSERT INTO Rendeles VALUES (1, 'Kovács Tihamér', '2025-02-25');
    INSERT INTO RendelesTetel VALUES (1, 1, 1, 2);
`;
  export const konyvtarSql = `
    CREATE TABLE Szerzo (id INTEGER PRIMARY KEY, nev TEXT NOT NULL, nemzetiseg TEXT);
    CREATE TABLE Kiado (id INTEGER PRIMARY KEY, nev TEXT, szekhely TEXT);
    CREATE TABLE Konyv (id INTEGER PRIMARY KEY, cim TEXT NOT NULL, szerzo_id INTEGER, kiado_id INTEGER, kiadas_eve INTEGER, FOREIGN KEY (szerzo_id) REFERENCES Szerzo(id), FOREIGN KEY (kiado_id) REFERENCES Kiado(id));
    CREATE TABLE Olvaso (id INTEGER PRIMARY KEY, nev TEXT, lakcim TEXT, tartozas INTEGER DEFAULT 0);
    CREATE TABLE Kolcsonzes (id INTEGER PRIMARY KEY, konyv_id INTEGER, olvaso_id INTEGER, datum_ki TEXT, datum_vissza TEXT, FOREIGN KEY (konyv_id) REFERENCES Konyv(id), FOREIGN KEY (olvaso_id) REFERENCES Olvaso(id));

    INSERT INTO Szerzo VALUES (1, 'Rejtő Jenő', 'Magyar'), (2, 'Isaac Asimov', 'Amerikai');
    INSERT INTO Kiado VALUES (1, 'Móra Könyvkiadó', 'Budapest'), (2, 'Galaktika', 'Budapest');
    INSERT INTO Konyv VALUES (1, 'A láthatatlan légió', 1, 1, 1939), (2, 'Alapítvány', 2, 2, 1951);
    INSERT INTO Olvaso VALUES (1, 'Varga Péter', 'Pécs, Fő u. 5.', 0), (2, 'Molnár Dóra', 'Győr, Tó u. 12.', 500);
    INSERT INTO Kolcsonzes VALUES (1, 1, 1, '2025-02-01', '2025-02-15'), (2, 2, 2, '2025-02-10', NULL);
`;